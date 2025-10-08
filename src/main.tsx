import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

// Vite provides the BASE_URL at build time (e.g. '/react-portfolio/').
// Fallback to '/' if it's not set. BrowserRouter's basename should be a string.
const basename = import.meta.env.BASE_URL;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
