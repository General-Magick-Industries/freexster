import React from "react";
import ReactDOM from "react-dom/client";
import { FreexsterApp } from "./app/FreexsterApp";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FreexsterApp />
  </React.StrictMode>,
);
