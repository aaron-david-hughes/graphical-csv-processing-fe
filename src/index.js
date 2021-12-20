import React from 'react';
import ReactDOM from 'react-dom';
import Home from "./home/Home";

ReactDOM.render(
    <Home
        config={JSON.parse(process.env.REACT_APP_CONFIG)}
    />,
    document.getElementById('root')
);