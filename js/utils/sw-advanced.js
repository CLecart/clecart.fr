// sw-advanced.js - Advanced Service Worker with background sync and advanced caching
const CACHE_NAME = "clecart-portfolio-v2";
const STATIC_CACHE_NAME = "clecart-static-v2";
const DYNAMIC_CACHE_NAME = "clecart-dynamic-v2";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/js/main.js",
  "/js/modules/darkmode.js",
  "/js/modules/animations.js",
  "/js/modules/navigation.js",
  "/assets/icons/favicon.ico",
  "/assets/icons/android-chrome-192x192.png",
  "/assets/icons/android-chrome-512x512.png",
  "/assets/manifest/site.webmanifest",
];

const CACHE_STRATEGIES = {
  CACHE_FIRST: "cache-first",
  NETWORK_FIRST: "network-first",
  STALE_WHILE_REVALIDATE: "stale-while-revalidate",
};

// Advanced installation with parallel caching
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .open(STATIC_CACHE_NAME)
        .then((cache) => cache.addAll(STATIC_ASSETS)),
      self.skipWaiting(),
    ])
  );
});

// Smart activation with cleanup
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches
        .keys()
        .then((cacheNames) =>
          Promise.all(
            cacheNames
              .filter(
                (name) =>
                  name !== STATIC_CACHE_NAME && name !== DYNAMIC_CACHE_NAME
              )
              .map((name) => caches.delete(name))
          )
        ),
      self.clients.claim(),
    ])
  );
});

// Advanced fetch with multiple strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls - Network First
  if (url.pathname.includes("/api/") || url.hostname.includes("emailjs")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets - Cache First
  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image" ||
    STATIC_ASSETS.includes(url.pathname)
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // HTML pages - Stale While Revalidate
  if (request.destination === "document") {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Default - Network First
  event.respondWith(networkFirst(request));
});

// Cache First Strategy
async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("Cache first failed:", error);
    return new Response("Offline", { status: 503 });
  }
}

// Network First Strategy
async function networkFirst(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response("Offline", { status: 503 });
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => {
      return cachedResponse || new Response("Offline", { status: 503 });
    });

  return cachedResponse || (await fetchPromise);
}

// Background sync for contact form
self.addEventListener("sync", (event) => {
  if (event.tag === "contact-form-sync") {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  // Implementation for offline form sync
  console.log("Background sync: Contact form");
}

// Push notifications (for future use)
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/assets/icons/android-chrome-192x192.png",
    badge: "/assets/icons/favicon-32x32.png",
    vibrate: [200, 100, 200],
    data: data.data,
    actions: data.actions,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Advanced performance monitoring
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_CACHE_STATS") {
    getCacheStats().then((stats) => {
      event.ports[0].postMessage(stats);
    });
  }
});

async function getCacheStats() {
  const cacheNames = await caches.keys();
  const stats = await Promise.all(
    cacheNames.map(async (name) => {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      return { name, size: keys.length };
    })
  );
  return stats;
}
