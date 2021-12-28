import '@babel/polyfill';
import ReactDOM from 'react-dom';
import React from 'react';

import { core as psCore } from 'photoshop';
import App from './App';

console.log("Refreshed")

// Render dialog to DOM, this will show the UI in the container, like a Panels
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

function commandHello() {
  psCore.showAlert({ message: '👋 Hi!' });
}

// @ts-expect-error install menu on window
window.commandHello = commandHello;
