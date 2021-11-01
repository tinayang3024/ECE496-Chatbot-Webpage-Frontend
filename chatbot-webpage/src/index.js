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

ReactDOM.render(
  <React.StrictMode>
    {/* <Router>
      <Switch>
        <Route path="/personality-page">
          <PersonalityPage />
        </Route>
        <Route path="/chat-page">
          <ChatPage />
        </Route>
      </Switch>
    </Router> */}
    {/* <ChatPage /> */}
    {/* <PersonalityPage /> */}
    <Router>
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/personality-page">personality</Link>
            </li>
            <li>
              <Link to="/chat-page">chat</Link>
            </li>
          </ul>
        </nav> */}

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Route exact path="/">
            <Redirect to="/personality-page" />
        </Route>
        <Switch>
          <Route path="/personality-page">
            <PersonalityPage />
          </Route>
          <Route path="/chat-page">
            <ChatPage />
          </Route>
        </Switch>
      </div>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
