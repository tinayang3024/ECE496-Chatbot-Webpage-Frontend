
class MessageParserFormal {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }
  
  parse(message) {
    console.log("user input: " + message)
    fetch('/interact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: message
    })
    .then((response) => {
        if (response.status == 200) {
            return response.json()
        } else {
            return ""
        }
    })
    .then(data=>{{
        if (data != "") {
          console.log("bot input: " + data.text)
          console.log("bot text_trans: ")
          this.actionProvider.greet("Original: " + data.text);
          const formal_trans = data.text_trans.split("|||")[0];
          this.actionProvider.greet("Paraphrased: " + formal_trans);
          
        } else {
          this.actionProvider.greet("Sorry, my backend had some issue:(");
        }
    }})
  }
}




export default MessageParserFormal;