/**
 * Service-worker registration — MUST live in the JS bundle.
 *
 * Why: this app is exported as a single-page app, and in that mode the
 * custom app/+html.tsx shell is NOT used — the served index.html is the
 * default Expo template, which contains no registration script. That is
 * why offline never actually worked (found 2026-11-01 from the user's
 * airplane-mode test: live index.html had zero "serviceWorker" strings).
 * Registering from the root layout guarantees the worker is registered
 * on every web load, whatever HTML shell served the page.
 */
import { Platform } from "react-native";

let done = false;

export function registerServiceWorker() {
  if (done) return;
  done = true;
  if (Platform.OS !== "web") return;
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  try {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        // If an updated worker is already waiting, activate it promptly.
        if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          if (nw) {
            nw.addEventListener("statechange", () => {
              if (nw.state === "installed" && navigator.serviceWorker.controller) {
                nw.postMessage({ type: "SKIP_WAITING" });
              }
            });
          }
        });
      })
      .catch(() => {});
  } catch {}
}
