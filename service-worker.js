/**
 * Service worker
 *
 * MUST stay at the repository root. A worker's scope is its own directory, so
 * from js/utils/ it could only ever control /js/utils/ — never the pages. The
 * usual escape, a Service-Worker-Allowed header, is not available: GitHub Pages
 * serves this repository and cannot set custom headers.
 */

/* Bump on any change to urlsToCache or to a caching strategy: activate() drops
   every cache whose name differs, which is the only way a stale entry ever
   leaves a visitor's browser. */
const CACHE_NAME = "portfolio-cache-v4";

const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/js/main.js",
  "/assets/images/profile.webp",
  "/assets/icons/favicon.ico",
];

/**
 * Builds the placeholder served when an image cannot be fetched offline
 * @description Generated in-worker rather than fetched from disk: a precached
 * asset that goes missing turns the fallback itself into a failed request
 * @returns {Response} An inline SVG placeholder
 */
function offlineImageResponse() {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225" role="img" aria-label="Image unavailable offline">',
    '<rect width="400" height="225" fill="#f8f9fa"/>',
    '<text x="200" y="118" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#6c757d">Image unavailable offline</text>',
    "</svg>",
  ].join("");

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-store",
    },
  });
}

/* A failed precache must fail the install: swallowing the error lets the
   worker activate with an empty cache, and activate() then deletes the
   previous, complete one. */
globalThis.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(urlsToCache);
      await globalThis.skipWaiting();
    })()
  );
});

globalThis.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const cacheDeletePromises = cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name));

        await Promise.all(cacheDeletePromises);
        await globalThis.clients.claim();
      } catch (error) {
        console.error("Cache activation failed:", error);
      }
    })()
  );
});

globalThis.addEventListener("fetch", (event) => {
  if (!event.request.url.startsWith(globalThis.location.origin)) {
    return;
  }

  const isNavigationRequest = event.request.mode === "navigate";
  const isImageRequest = event.request.destination === "image";
  const isStyleRequest = event.request.destination === "style";
  const isScriptRequest = event.request.destination === "script";

  if (isNavigationRequest) {
    event.respondWith(handleNavigationRequest(event.request));
  } else if (isImageRequest) {
    event.respondWith(handleImageRequest(event.request));
  } else if (isStyleRequest || isScriptRequest) {
    event.respondWith(handleAssetRequest(event.request));
  }
});

/**
 * Serve a page from the network, else its cached copy, else the cached home page
 * @param {Request} request - Navigation request
 * @returns {Promise<Response>} Response from network or cache
 */
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    throw new Error("Network response not ok");
  } catch (error) {
    console.warn("Navigation request failed, serving cached fallback:", error);
    const cachedResponse = await caches.match(request);
    return cachedResponse ?? caches.match("/index.html");
  }
}

/**
 * Serve an image from the cache first, else the network, else a placeholder
 * @param {Request} request - Image request
 * @returns {Promise<Response>} Response from cache, network or fallback
 */
async function handleImageRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    throw new Error("Network response not ok");
  } catch (error) {
    console.warn("Image request failed, serving offline fallback:", error);
    return offlineImageResponse();
  }
}

/**
 * Serve CSS and JS from the network, falling back to the cache only offline
 * @description CSS and JS are the files that change on every deployment, and
 * nothing here fingerprints their URLs — no build step, no content hash. Served
 * cache-first they would pin a visitor to the version they first loaded, with
 * no event able to invalidate it, so a deployment would simply never reach
 * anyone who had already visited. The cache is therefore an offline fallback
 * only, never a shortcut.
 * @param {Request} request - Asset request (CSS/JS)
 * @returns {Promise<Response>} Response from network, or cache when offline
 */
async function handleAssetRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.warn("Asset fetch failed, serving cached copy:", error);
      return cachedResponse;
    }
    console.error("Asset fetch failed and nothing cached:", error);
    throw error;
  }
}
