/**
 * Service worker
 *
 * MUST stay at the repository root. A worker's scope is its own directory, so
 * from js/utils/ it could only ever control /js/utils/ — never the pages. The
 * usual escape, a Service-Worker-Allowed header, is not available: GitHub Pages
 * serves this repository and cannot set custom headers.
 *
 * Nothing is precached, so there is no list of files to keep in step with the
 * site. Responses are stored as they pass; the visit that installs the worker
 * is not controlled by it, so that page sends the list of what it loaded
 * instead (see sw-register.js).
 */

/* Bump on any change to a caching strategy: activate() drops every cache whose
   name differs, which is the only way a stale entry ever leaves a visitor's
   browser. */
const CACHE_NAME = "portfolio-cache-v5";

/* Media are streamed in ranges and weigh megabytes: the browser handles them
   untouched, and a partial response could not be stored anyway. */
const PASS_THROUGH = new Set(["video", "audio", "track"]);

/**
 * Builds the placeholder served when an image cannot be fetched offline
 * @description Generated in-worker rather than fetched from disk: a cached
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

/**
 * Keep a copy of a response that can serve the same request again
 * @description Only a complete 200: an error page or a 206 range must never
 * stand in for the resource later.
 * @param {Request|string} request - What was asked for
 * @param {Response} response - What the network answered
 * @returns {Promise<void>} Settles once the copy is stored
 */
async function store(request, response) {
  if (response.status !== 200) {
    return;
  }
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
}

globalThis.addEventListener("install", () => {
  globalThis.skipWaiting();
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

/* The page that registered this worker loaded everything before the worker
   existed; it sends those URLs so its own visit is available offline too. */
globalThis.addEventListener("message", (event) => {
  if (
    event.origin !== globalThis.location.origin ||
    event.data?.type !== "cache-loaded" ||
    !Array.isArray(event.data.urls)
  ) {
    return;
  }
  const sameOrigin = event.data.urls.filter(
    (url) => new URL(url).origin === globalThis.location.origin
  );
  event.waitUntil(
    Promise.allSettled(
      sameOrigin.map(async (url) => store(url, await fetch(url)))
    )
  );
});

globalThis.addEventListener("fetch", (event) => {
  const { request } = event;
  if (
    request.method !== "GET" ||
    !request.url.startsWith(globalThis.location.origin) ||
    PASS_THROUGH.has(request.destination)
  ) {
    return;
  }

  if (request.destination === "image") {
    event.respondWith(cacheFirst(event));
  } else {
    event.respondWith(networkFirst(event));
  }
});

/**
 * Serve from the network whenever it answers, from the cache only offline
 * @description Pages, CSS, JS, fonts and the icon sprite change with every
 * deployment, and nothing here fingerprints their URLs — no build step, no
 * content hash. Served cache-first they would pin a visitor to the version
 * they first loaded, with no event able to invalidate it, so a deployment
 * would simply never reach anyone who had already visited. Whatever the
 * network answers is returned as is, a 404 included: only a fetch that throws,
 * the mark of being offline, falls back to the copy.
 * @param {FetchEvent} event - Any same-origin GET that is neither an image nor media
 * @returns {Promise<Response>} The network response, else the cached copy, else a network error
 */
async function networkFirst(event) {
  const { request } = event;
  try {
    const networkResponse = await fetch(request);
    event.waitUntil(store(request, networkResponse.clone()));
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    console.warn("Offline and not cached:", request.url, error);
    return Response.error();
  }
}

/**
 * Serve an image from the cache first, else the network, else a placeholder
 * @param {FetchEvent} event - Image request
 * @returns {Promise<Response>} Response from cache, network or fallback
 */
async function cacheFirst(event) {
  const { request } = event;
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    event.waitUntil(store(request, networkResponse.clone()));
    return networkResponse;
  } catch (error) {
    console.warn("Image request failed, serving offline fallback:", error);
    return offlineImageResponse();
  }
}
