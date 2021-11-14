
// ActionProvider starter code
class ActionProvider {
    constructor(createChatBotMessage, setStateFunc, createClientMessage) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
        this.createClientMessage = createClientMessage;
    }

    greet = (message_text) => {
        const message = this.createChatBotMessage(message_text);
        this.addMessageToState(message);
    };

    addMessageToState = (message) => {
        // console.log("what is this?" + JSON.stringify(message))
        this.setState((prevState) => ({
            ...prevState,
            messages: [...prevState.messages, message],
        }));
    };
}


export default ActionProvider;