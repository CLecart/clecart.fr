/**
 * @fileoverview Service Worker pour Progressive Web App
 * @description Gestion du cache, stratégies de récupération et fonctionnalités offline
 * @version 1.0.0
 * @author Christophe Lecart <djlike@hotmail.fr>
 */

/**
 * Nom de version du cache principal
 * @constant {string}
 * @description Identifiant unique pour la gestion des versions de cache
 */
const CACHE_NAME = "clecart-portfolio-v1";

/**
 * URLs des ressources statiques à mettre en cache
 * @constant {string[]}
 * @description Liste des fichiers essentiels pour le fonctionnement offline
 */
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

/**
 * Gestionnaire d'installation du Service Worker
 * @event install
 * @description Met en cache les ressources statiques et active immédiatement
 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        /**
         * Mise en cache des ressources statiques essentielles
         * @description Télécharge et stocke tous les fichiers critiques
         */
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

/**
 * Gestionnaire d'activation du Service Worker
 * @event activate
 * @description Nettoie les anciens caches et prend le contrôle des clients
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        /**
         * Suppression des anciens caches obsolètes
         * @description Conserve uniquement le cache de version actuelle
         */
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

/**
 * Gestionnaire de récupération avec stratégies de cache intelligentes
 * @event fetch
 * @description Implémente Network-First pour HTML/JSON et Cache-First pour assets
 */
self.addEventListener("fetch", (event) => {
  /**
   * Filtrage des requêtes cross-origin
   * @description Ignore les requêtes externes pour éviter les erreurs CORS
   */
  if (!event.request.url.startsWith(self.location.origin)) return;

  /**
   * Analyse du type de requête basée sur les en-têtes
   * @description Détermine la stratégie de cache appropriée
   */
  const acceptHeader = event.request.headers.get("Accept") || "";
  const isHTMLRequest = acceptHeader.includes("text/html");
  const isJSONRequest = event.request.url.includes(".json");

  /**
   * Stratégie Network-First pour HTML et JSON
   * @description Privilégie le réseau pour le contenu dynamique
   */
  if (isHTMLRequest || isJSONRequest) {
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
          /**
           * Fallback vers le cache en cas d'échec réseau
           * @description Assure la disponibilité offline
           */
          return caches.match(event.request);
        })
    );
    return;
  }

  /**
   * Stratégie Cache-First pour les assets statiques
   * @description Optimise les performances en servant depuis le cache
   */
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((fetchResponse) => {
        /**
         * Validation de la réponse avant mise en cache
         * @description Vérifie status, type et méthode HTTP
         */
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

/**
 * Gestionnaire de messages pour mise à jour forcée
 * @event message
 * @description Permet le skipWaiting pour activation immédiate des mises à jour
 */
self.addEventListener("message", (event) => {
  /**
   * Traitement du message skipWaiting
   * @description Active immédiatement le nouveau Service Worker
   */
  if (event.data && event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
