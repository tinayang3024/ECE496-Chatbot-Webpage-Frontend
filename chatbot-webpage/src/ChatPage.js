// import logo from './logo.svg';
import './ChatPage.css';
import Chatbot from "react-chatbot-kit";
import config from "./chatbot/config";
import ActionProvider from "./chatbot/ActionProvider";
import MessageParserFormal from "./chatbot/MessageParserFormal";
import MessageParserInformal from "./chatbot/MessageParserInformal";
function ChatPage(props) {
  if (props.formal) {
    return (
      <div className="App">
        <header className="App-header">
          <Chatbot
            config={config}
            actionProvider={ActionProvider}
            messageParser={MessageParserFormal}
          />
        </header>
      </div>
    );
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <Chatbot
            config={config}
            actionProvider={ActionProvider}
            messageParser={MessageParserInformal}
          />
        </header>
      </div>
    );
  }
}

export default ChatPage;
