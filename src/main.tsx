import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme based on localStorage or prefers-color-scheme
try {
  const stored = localStorage.getItem("theme");
  if (stored === "dark") document.documentElement.classList.add("dark");
  else if (stored === "light") document.documentElement.classList.remove("dark");
  else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark");
  }
} catch {
  // ignore
}

createRoot(document.getElementById("root")!).render(<App />);
