import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
// import { BrowserRouter } from "react-router-dom";
import { HashRouter } from "react-router-dom";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter basename="/frontendrestaurantedemo/">
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
