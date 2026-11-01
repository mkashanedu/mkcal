/**
 * PeadsCal Service Worker — full-app offline support (v3)
 *
 * Strategy:
 *  - On install, pre-cache the app shell AND the real JS/CSS bundles.
 *    The bundle file names are discovered by reading the served index
 *    HTML, so this keeps working across deploys whose file hashes change.
 *  - Key app routes are pre-cached too, so every main section opens
 *    offline after the very first visit — not only after it was opened
 *    once while online.
 *  - Runtime requests stay cache-first with network fallback and
 *    background revalidation for navigations (unchanged from v2).
 */

const CACHE_NAME = "peadscal-v3";
const OFFLINE_URL = "/";

const SHELL = ["/", "/manifest.json", "/icon.png", "/favicon.png"];

// Main sections — the SPA serves the same index for each of these, and
// caching them under their own URLs makes direct offline opens reliable.
const ROUTES = [
  "/calculator",
  "/formulary",
  "/emergency",
  "/infusion",
  "/calcs",
  "/tools",
  "/favorites",
  "/toxicology",
];

// Pull every same-origin script/style/asset URL out of the index HTML.
async function discoverBundleAssets() {
  try {
    const res = await fetch("/", { credentials: "same-origin" });
    if (!res.ok) return [];
    const html = await res.text();
    const urls = new Set();
    const re = /(?:src|href)="([^"]+)"/g;
    let m;
    while ((m = re.exec(html)) !== null) {
      const u = m[1];
      if (
        u.startsWith("/_expo/") ||
        u.startsWith("/assets/") ||
        u.endsWith(".js") ||
        u.endsWith(".css")
      ) {
        urls.add(u);
      }
    }
    return [...urls];
  } catch {
    return [];
  }
}

// Cache URLs one by one — a single 404 must not sink the whole install.
async function cacheAllSettled(cache, urls) {
  await Promise.allSettled(urls.map((u) => cache.add(u)));
}

// ── Install: pre-cache shell + bundles + routes ──────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cacheAllSettled(cache, SHELL);
      const assets = await discoverBundleAssets();
      await cacheAllSettled(cache, assets);
      await cacheAllSettled(cache, ROUTES);
      await self.skipWaiting();
    })()
  );
});

// ── Activate: purge old caches ───────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch: Cache-First with network fallback ─────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;
  if (!request.url.startsWith("http")) return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        if (request.mode === "navigate") {
          fetch(request)
            .then((fresh) => {
              if (fresh && fresh.status === 200) {
                caches.open(CACHE_NAME).then((c) => c.put(request, fresh));
              }
            })
            .catch(() => {});
        }
        return cached;
      }

      return fetch(request)
        .then((response) => {
          if (
            isSameOrigin &&
            response &&
            response.status === 200 &&
            response.type !== "opaque"
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          if (request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }
          return new Response(
            JSON.stringify({ error: "offline", cached: false }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            }
          );
        });
    })
  );
});

// ── Message: manual cache refresh ────────────────────────────────────────────
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data && event.data.type === "CLEAR_CACHE") {
    caches.delete(CACHE_NAME);
  }
});
