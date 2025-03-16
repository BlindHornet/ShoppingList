//Library Imports
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

//Component Imports
import App from "./App.tsx";

//Style Imports
import "./index.css";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
// index.tsx or main.tsx
// import React from "react";
// import ReactDOM from "react-dom";
// import { BrowserRouter as Router } from "react-router-dom";
// import App from "./App";

// ReactDOM.render(
//   <Router>
//     <App />
//   </Router>,
//   document.getElementById("root")
// );
