import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Predictor from "./Predictor";

// Use createRoot instead of ReactDOM.render for React 18
const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Predictor />
  </React.StrictMode>
);
