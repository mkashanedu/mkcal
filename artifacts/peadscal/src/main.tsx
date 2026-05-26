import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

/* ── PWA Service Worker Registration ─────────────────────────────────── */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/peadscal/service-worker.js", { scope: "/peadscal/" })
      .then((reg) => {
        console.info("[PeadsCal] SW registered:", reg.scope);
      })
      .catch((err) => {
        console.warn("[PeadsCal] SW registration failed:", err);
      });
  });
}
