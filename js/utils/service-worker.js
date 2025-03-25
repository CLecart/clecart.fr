// Service Worker pour Progressive Web App
const CACHE_NAME = "clecart-portfolio-v1";
const STATIC_CACHE_URLS = [
  "/",
  "/index.html",
  "/styles.css",
  "/js/main.js",
  "/js/modules/darkmode.js",
  "/js/modules/animations.js",
  "/js/modules/navigation.js",
  "/js/modules/contact-form.js",
  "/js/utils/gdpr.js",
  "/js/utils/modal.js",
  "/assets/icons/favicon.ico",
  "/assets/icons/apple-touch-icon.png",
  "/assets/icons/favicon-16x16.png",
  "/assets/icons/favicon-32x32.png",
  "/assets/manifest/site.webmanifest",
];

// Installation du Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Stratégie de cache: Network First pour le contenu dynamique, Cache First pour les assets statiques
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Network first for HTML and JSON
  if (
    event.request.headers.get("Accept").includes("text/html") ||
    event.request.url.includes(".json")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          let responseToCache = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Cache first for static assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((fetchResponse) => {
        // Don't cache responses for requests that aren't GET
        if (
          !fetchResponse ||
          fetchResponse.status !== 200 ||
          fetchResponse.type !== "basic" ||
          event.request.method !== "GET"
        ) {
          return fetchResponse;
        }

        let responseToCache = fetchResponse.clone();
        caches
          .open(CACHE_NAME)
          .then((cache) => cache.put(event.request, responseToCache));
        return fetchResponse;
      });
    })
  );
});

// Permet la mise à jour du contenu offline
self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
