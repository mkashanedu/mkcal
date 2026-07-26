/**
 * PeadsCal Service Worker — Cache-First offline strategy
 * Caches all app shell assets on install, serves from cache first,
 * falls back to network, and provides SPA navigation fallback.
 */

const CACHE_NAME = "peadscal-v2";
const OFFLINE_URL = "/";

// Assets to pre-cache on install
const PRE_CACHE = [
  "/",
  "/manifest.json",
  "/icon.png",
  "/favicon.png",
];

// ── Install: pre-cache shell ─────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRE_CACHE))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: purge old caches ───────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_NAME)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch: Cache-First with network fallback ─────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only intercept GET requests over HTTP/HTTPS
  if (request.method !== "GET") return;
  if (!request.url.startsWith("http")) return;

  // Skip cross-origin requests we cannot cache safely
  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  event.respondWith(
    caches.match(request).then((cached) => {
      // Cache hit — return immediately (Cache-First)
      if (cached) {
        // Background revalidation for HTML navigation requests
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

      // Cache miss — fetch from network
      return fetch(request)
        .then((response) => {
          // Only cache valid same-origin responses
          if (
            isSameOrigin &&
            response &&
            response.status === 200 &&
            response.type !== "opaque"
          ) {
            const clone = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // SPA navigation fallback — serve cached root
          if (request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }
          // For other failures, return a minimal offline response
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
