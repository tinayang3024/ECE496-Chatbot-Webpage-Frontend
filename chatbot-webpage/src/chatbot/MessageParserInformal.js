
class MessageParserInformal {
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
            const informal_trans = data.text_trans.split("|||")[1];
            this.actionProvider.greet("Paraphrased: " + informal_trans);
            
            
          } else {
            this.actionProvider.greet("Sorry, my backend had some issue:(");
          }
      }})
    }
  }

export default MessageParserInformal;
