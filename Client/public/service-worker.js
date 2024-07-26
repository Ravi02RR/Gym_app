const CACHE_NAME = "offline-page";
const OFFLINE_URL = "offline.html";

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([OFFLINE_URL]);
        })
    );
});

self.addEventListener("fetch", event => {
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.open(CACHE_NAME).then(cache => {
                    return cache.match(OFFLINE_URL);
                });
            })
        );
    }
});
