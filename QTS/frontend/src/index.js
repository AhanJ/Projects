import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// React 18 introduced a feature where it intentionally mounts and unmounts components twice in development mode to help identify side effects. This can cause useEffect to run twice in development. This behavior is specific to development mode and does not occur in production.
