// Mandubun PWA Service Worker
const CACHE_NAME = "mandubun-v3";
const API_CACHE_NAME = "mandubun-api-v1";
const BASE_PATH = "/app";

const SHELL_ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/styles/app.css`,
  `${BASE_PATH}/dist/app.js`,
  `${BASE_PATH}/manifest.webmanifest`,
];

// API paths that should be cached for offline practice
const CACHEABLE_API_PATHS = [
  "/vocab_due_for_review",
  "/grammar_due_for_review",
  "/learning/overview",
  "/learning/vocab",
  "/learning/grammar",
  "/catalog/series",
  "/catalog/episodes",
  "/catalog/genres",
];

// Install: cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  const validCaches = [CACHE_NAME, API_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => !validCaches.includes(k)).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // API calls
  if (url.hostname === "api.mandubun.com") {
    // POST requests: always go to network (never cache)
    if (event.request.method !== "GET") {
      event.respondWith(fetch(event.request));
      return;
    }

    // Panel images: cache-first (images don't change)
    if (url.pathname.startsWith("/pwa/panel_image/")) {
      event.respondWith(
        caches.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(API_CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return res;
          });
        })
      );
      return;
    }

    // Cacheable API data: network-first, fall back to cache
    const isCacheable = CACHEABLE_API_PATHS.some((p) => url.pathname.startsWith(p));
    if (isCacheable) {
      event.respondWith(
        fetch(event.request)
          .then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(API_CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return res;
          })
          .catch(() => caches.match(event.request))
      );
      return;
    }

    // Other API calls: network-only
    event.respondWith(fetch(event.request));
    return;
  }

  // Shell assets: cache-first with network fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        if (res.ok && url.origin === self.location.origin) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return res;
      });
    })
  );
});
