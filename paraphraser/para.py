from functools import partial
import torch
from torch import nn
import torch.nn.functional as F
from transformers import (AdamW, GPT2Config, GPT2LMHeadModel, GPT2Tokenizer, get_linear_schedule_with_warmup)

class GPT2Wrapper(nn.Module):
    def __init__(self, gpt2, device):
        super(GPT2Wrapper, self).__init__()
        self.gpt2 = gpt2
        self.device = device
    
    def forward(self, batch):
        gpt2 = self.gpt2
        # send data to device
        sentences = batch['sentence'].to(self.device)
        labels = batch['label'].to(self.device)
        segments = batch['segment'].to(self.device)
        # train gpt2
        gpt2.train()
        outputs = gpt2(input_ids=sentences, token_type_ids=segments, labels=labels)
        loss = {'lm': outputs[0]}
        return loss # loss
    
    def evaluate(self, batch):
        gpt2 = self.gpt2
        # send data to device
        sentences = batch["sentence"].to(self.device)
        labels = batch["label"].to(self.device)
        segments = batch["segment"].to(self.device)
        # evaluate with validation data
        with torch.no_grad():
            outputs = gpt2(input_ids=sentences, token_type_ids=segments, labels=labels)
            lm_loss = outputs[0]
        return lm_loss.mean().item()
    
    def generate(self, gpt2_sentences, segments, global_dense_vectors=None, stop_token="eos",
                 init_context_size=1, eos_token_id=None, beam_size=-1, beam_search_scoring="normalize"): # TODO: omit sample sequence for now
        if stop_token == "eos":
            gen_length = None # Setting this to None defaults output length to 1024
        else:
            gen_length = len(gpt2_sentences[0]) - init_context_size # produce output the same length as data sample
        # TODO: dense_length = 0 if style_content_vectors is None else len(style_content_vectors[0])
        dense_length = 0

        if beam_size > 1:
            out, scores = beam_search(
                model=self.gpt2,
                length=gen_length,
                context=gpt2_sentences[:, 0:init_context_size],
                # style_content_vectors=style_content_vectors,  # mixed_style_content,
                segments=segments[:, 0:dense_length + init_context_size],
                eos_token_id=eos_token_id,
                beam_size=beam_size,
                beam_search_scoring=beam_search_scoring
            )
        
        return out, dense_length, scores

def init_gpt2_model(save_dir, device, load_tokenizer=False):
    model = GPT2LMHeadModel.from_pretrained(save_dir)
    model.to(device)
    if load_tokenizer:
        tokenizer = GPT2Tokenizer.from_pretrained(save_dir)
    else:
        tokenizer = None
    return GPT2Wrapper(gpt2=model, device=device), tokenizer

def score_fn(x, length_normalize):
    if length_normalize:
        return x["score"] / len(x["sequence"])
    else:
        return x["score"]

def beam_search(model, length, context, segments, eos_token_id, beam_size=1, beam_search_scoring="normalize"):
    # decide whether to employ length normalization
    if beam_search_scoring == "normalize":
        _score_fn = partial(score_fn, length_normalize=True)
    else:
        _score_fn = partial(score_fn, length_normalize=False)

    # set length for generated sentence
    if length is None:
        gen_length = 1024 - context.shape[1] # max output (2-sent) len = 1024
    else:
        gen_length = length
    
    with torch.no_grad():
        # get logits and past_key_values from model
        outputs = model(input_ids=context, token_type_ids=segments)
        logits, past = outputs[0], outputs[1]

        # pick the top beam_size logits
        log_probs = F.log_softmax(logits[:, -1, :], dim=-1)
        top_scores, top_indices = torch.topk(input=log_probs, k=beam_size, dim=-1) # top score shape: input batch size * beam_size
        
        '''
        all_beams = list of (list of size beam_size) of input batch_size
                    [[(beam 1 of element 1),  ...  (beam beam_size of element 1)]
                     [(beam 1 of element 2),  ...  (beam beam_size of element 2)]
                                               ...
                     [(beam 1 of element bs), ... (beam beam_size of element bs)]]
        '''
        all_beams = []
        # add first token to generated sequence based on top beam_size probabilities
        for elem_num, (ts, ti) in enumerate(zip(top_scores, top_indices)):
            curr_element = []
            for bs in range(beam_size):
                curr_element.append({
                    "score": ts[bs],
                    "past": elem_num,
                    "sequence": [x.unsqueeze(0).unsqueeze(0) for x in context[elem_num]] + [ti[bs].unsqueeze(0).unsqueeze(0)],
                    "eos_emitted": False
                })
            all_beams.append(curr_element)
        
        # token type ids for the generated sequence, only need the last id in `segments` as we are using past key values
        # one time operation as token type ids remain the same for all the following generated sequence
        tiled_segments = torch.cat([segments[:, -1:] for _ in range(beam_size)], dim=-1)

        for i in range(1, gen_length): # start from 1 to skip the first token, which is generated just now
            # check if all beams have emitted an EOS token
            all_eos = all([beam["eos_emitted"] for element in all_beams for beam in element])
            if all_eos:
                break

            # merge input_ids at current step (new batch size = input batch size * beam size)
            latest_input_ids = torch.cat([beam["sequence"][-1] for element in all_beams for beam in element], dim=0)
            # merge past_key_values at current step
            past_indices = [beam["past"] for element in all_beams for beam in element]
            past = [(pp[0][past_indices, :, :, :], pp[1][past_indices, :, :, :]) for pp in past] # index 0: keys; index 1: values

            outputs = model(input_ids=latest_input_ids, token_type_ids=tiled_segments, past_key_values=past)
            logits, past = outputs[0], outputs[1]
            # pick the top beam_size logits
            log_probs = F.log_softmax(logits[:, -1, :], dim=-1)
            top_scores, top_indices = torch.topk(input=log_probs, k=beam_size, dim=-1) # shape will be new batch size * 3

            new_beams = []
            curr_element = []
            for idx, (ts, ti) in enumerate(zip(top_scores, top_indices)):
                elem_num = idx // beam_size
                elem_beam_num = idx % beam_size
                old_beam = all_beams[elem_num][elem_beam_num]

                # generation end, stop creating new beams for this beam
                if old_beam["eos_emitted"]:
                    curr_element.append(old_beam)
                else:
                    # create beam_size more beams for each old beam that has not ended
                    for bs in range(beam_size):
                        token = ti[bs].unsqueeze(0).unsqueeze(0)
                        curr_element.append({
                            "score": old_beam["score"] + ts[bs],
                            "past": idx,
                            "sequence": old_beam["sequence"] + [token],
                            "eos_emitted": token.item() == eos_token_id
                        })
                # Finished looking at one element
                if elem_beam_num == beam_size - 1:
                    new_beams.append(curr_element)
                    curr_element = [] # reset curr_element for next element

            # sort beams by score and keep the top beam_size beams for next iteration
            all_beams = []
            for elem in new_beams:
                elem.sort(key=lambda x: _score_fn(x), reverse=True)
                all_beams.append(elem[:beam_size])
        
        final_beams = []
        for elem in all_beams:
            elem.sort(key=lambda x: _score_fn(x), reverse=True)
            final_beams.append(elem[:1])

        final_input_ids = [torch.cat(elem[0]["sequence"], dim=1).squeeze(0) for elem in final_beams]
        return final_input_ids, [_score_fn(fb[0]) for fb in final_beams]