import React from 'react';
import ReactDOM from 'react-dom';
import Home from "./home/Home";
import Config from "./config.json";

ReactDOM.render(
    <Home
        config={Config}
    />,
    document.getElementById('root')
);