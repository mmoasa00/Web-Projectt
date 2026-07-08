/*
 * Minimal service worker for the Nava PWA.
 *
 * Strategy: network-first with a cache fallback. Successful GET responses are
 * cached so the app shell keeps working offline. This is intentionally simple
 * for Phase 1; Phase 2 can swap in a smarter strategy (e.g. cache audio).
 */
const CACHE = "nava-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches
          .open(CACHE)
          .then((cache) => cache.put(request, copy))
          .catch(() => {});
        return response;
      })
      .catch(() => caches.match(request)),
  );
});
