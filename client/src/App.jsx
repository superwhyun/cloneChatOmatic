import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

import "./index.css";
import Chat from "./Chat";

// const App = () => <div>Hi there, I'm React from Webpack 5.</div>;


const App = () => <Chat />;


ReactDOM.render(

    <App />, document.getElementById("app")    

);
