/**
 * Service Worker for caching and offline functionality
 * @fileoverview Service Worker implementation
 * @description Handles cache, fetch strategies and offline features
 */

const CACHE_NAME = 'portfolio-cache-v2';
const CACHE_FALLBACK = 'portfolio-fallback-v1';

/**
 * Static resources URLs to cache
 */
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/js/main.js',
  '/js/critical.js',
  '/css/critical.css',
  '/assets/images/profile.jpg',
  '/assets/icons/favicon.ico',
  '/assets/icons/apple-touch-icon.png',
  '/assets/icons/android-chrome-192x192.png',
  '/assets/icons/android-chrome-512x512.png',
  '/assets/manifest/site.webmanifest'
];

const offlinePage = '/offline.html';
const offlineImage = '/assets/images/offline-fallback.svg';

/**
 * Service Worker installation event
 * @event install
 * @description Caches static resources and activates immediately
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        /**
         * @description Downloads and stores all critical files
         */
        await cache.addAll(urlsToCache);
        await self.skipWaiting();
      } catch (error) {
        console.error('Cache installation failed:', error);
      }
    })()
  );
});

/**
 * Service Worker activation event
 * @event activate
 * @description Cleans old caches and takes control of clients
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        /**
         * Remove obsolete old caches
         */
        const cacheNames = await caches.keys();
        const cacheDeletePromises = cacheNames
          .filter(name => name !== CACHE_NAME && name !== CACHE_FALLBACK)
          .map(name => caches.delete(name));
        
        await Promise.all(cacheDeletePromises);
        await self.clients.claim();
      } catch (error) {
        console.error('Cache activation failed:', error);
      }
    })()
  );
});

/**
 * Fetch handler with intelligent cache strategies
 * @event fetch
 * @description Implements Network-First for HTML/JSON and Cache-First for assets
 */
self.addEventListener('fetch', (event) => {
  /**
   * Cross-origin request filtering
   * @description Ignores external requests to avoid CORS errors
   */
  if (!event.request.url.startsWith(self.location.origin)) return;

  /**
   * Request type analysis based on headers
   * @description Determines appropriate cache strategy
   */
  const isNavigationRequest = event.request.mode === 'navigate';
  const isImageRequest = event.request.destination === 'image';
  const isStyleRequest = event.request.destination === 'style';
  const isScriptRequest = event.request.destination === 'script';

  if (isNavigationRequest) {
    event.respondWith(handleNavigationRequest(event.request));
  } else if (isImageRequest) {
    event.respondWith(handleImageRequest(event.request));
  } else if (isStyleRequest || isScriptRequest) {
    event.respondWith(handleAssetRequest(event.request));
  }
});

/**
 * Navigation request handler (Network-First strategy)
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
    throw new Error('Network response not ok');
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || caches.match('/index.html');
  }
}

/**
 * Image request handler (Cache-First with fallback)
 * @param {Request} request - Image request
 * @returns {Promise<Response>} Response from cache, network or fallback
 */
async function handleImageRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    throw new Error('Network response not ok');
  } catch (error) {
    return caches.match(offlineImage);
  }
}

/**
 * Asset request handler (Cache-First strategy)
 * @param {Request} request - Asset request (CSS/JS)
 * @returns {Promise<Response>} Response from cache or network
 */
async function handleAssetRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    return networkResponse;
  } catch (error) {
    console.error('Asset fetch failed:', error);
    throw error;
  }
}
