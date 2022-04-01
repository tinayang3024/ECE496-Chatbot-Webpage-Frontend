import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChatPage from './ChatPage';
import PersonalityPage from './PersonalityPage';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

// ReactDOM.render(
//   <React.StrictMode>
//      {/* <ChatPage /> */}
//     <Router>
//       <div>
//         <Route exact path="/ECE496-Chatbot-Webpage-Frontend">
//             <Redirect to="/personality-page" />
//         </Route>
//         <Route exact path="/">
//             <Redirect to="/personality-page" />
//         </Route>
//         <Switch>
//           <Route path="/personality-page">
//             <PersonalityPage formal={formal} setFormal={setFormal}/>
//           </Route>
//           <Route path="/chat-page">
//             <ChatPage formal={formal}/>
//           </Route>
//         </Switch>
//       </div>
//     </Router>
//   </React.StrictMode>,
//   document.getElementById('root')
// );


function Index() {
  const [formal, setFormal] = React.useState(false);
  return (
    <React.StrictMode>
      <Router>
        <div>
          <Route exact path="/ECE496-Chatbot-Webpage-Frontend">
              <Redirect to="/personality-page" />
          </Route>
          <Route exact path="/">
              <Redirect to="/personality-page" />
          </Route>
          <Switch>
            <Route path="/personality-page">
              <PersonalityPage formal={formal} setFormal={setFormal}/>
            </Route>
            <Route path="/chat-page">
              <ChatPage formal={formal}/>
            </Route>
          </Switch>
        </div>
      </Router>
    </React.StrictMode>
  )
}

ReactDOM.render(
  <Index/>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
