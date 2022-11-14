import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./App";

let url = localStorage.getItem("@currUrl") || "";

const query = window.location.href.split("?");
const query_params = query[1].split("&");
const params = query_params[0].split("=");
const property_params = query_params[1].split("=");
console.log(query_params);
const root = ReactDOM.createRoot(document.getElementById("root"));
const currUrl = params[1] || "";
if (url !== currUrl) {
  localStorage.setItem("@currUrl", currUrl);
  window.location.reload(true);
}

root.render(
  <React.StrictMode>
    <App
      parent_url={currUrl}
      property_url={property_params[1] || ""}
      unread={query_params[2].split("=")[1]}
      showHome={query_params[3].split("=")[1] === "true" ? true : false}
      properties={query_params[4].split("=")[1]}
    />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
