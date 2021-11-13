# Usage
To begin paraphrasing, run `python infer.py`. Make sure to change the `load_path` to the directory containing the pretrained model (chkpt-21918)

# Files
* chkpy-21918: directory with the fine-tuned gpt2 model for paraphraser task
* infer.py: main process, loads the trained model and accepts and processes input sentences
* para.py: a wrapper to the inner gpt2 model, runs beam search on the output logits to generate the output sentence