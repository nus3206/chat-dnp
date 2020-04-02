import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
 

/*
ReactDOM.render(
    <Router>
        <Route path="/chat">
        <App />
        </Route>
    </Router>,
document.getElementById('root')

);
*/
    const routing = (
        <Router>
        <div>
            <Route path="/chatuser/user_id/:id/friend_id/:fid" component={App} />
            <Route path="/chatroom/user_id/:id/name/:name" component={App} />
            <Route path="/chatgroup/user_id/:id/name/:name" component={App} />
        </div>
        </Router>
  )
  ReactDOM.render(routing, document.getElementById('root'));
    registerServiceWorker();
