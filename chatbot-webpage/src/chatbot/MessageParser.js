
class MessageParser {
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
          this.actionProvider.greet(data.text);
        } else {
          this.actionProvider.greet("Sorry, my backend had some issue:(");
        }
    }})
  }
}

export default MessageParser;