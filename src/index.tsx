import '@babel/polyfill';
import ReactDOM from 'react-dom';
import React from 'react';
import App from './App';

console.log('refreshed');

// Render dialog to DOM, this will show the UI in the container, like a Panels
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

