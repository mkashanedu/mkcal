const CACHE_NAME = 'peadscal-v2';
const STATIC_ASSETS = [
  '/peadscal/',
  '/peadscal/index.html',
  '/favicon.svg',
  '/manifest.json'
];

/* ── INSTALL: pre-cache known static assets ─────────────────────────── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    }).then(() => self.skipWaiting())
  );
});

/* ── ACTIVATE: remove stale caches from previous versions ───────────── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── FETCH: cache-first for static assets, network-first for API ─────── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* Never intercept cross-origin requests or non-GET */
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  /* API calls — network first, no caching */
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  /* Navigation requests — serve shell, fall back to network */
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/peadscal/').then((cached) => cached || fetch(request))
    );
    return;
  }

  /* Static assets — cache-first, update cache in background (stale-while-revalidate) */
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request).then((cached) => {
        const networkFetch = fetch(request).then((response) => {
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(() => cached);

        return cached || networkFetch;
      })
    )
  );
});
