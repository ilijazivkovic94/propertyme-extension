import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';

let url = localStorage.getItem('@currUrl') || "";

const params = window.location.href.split("=");

const root = ReactDOM.createRoot(document.getElementById('root'));
const currUrl = params[2] || "";
if (url !== currUrl) {
  localStorage.setItem('@currUrl', currUrl);
  window.location.reload(true);
}

root.render(
  <React.StrictMode>
    <App parent_url={currUrl} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
