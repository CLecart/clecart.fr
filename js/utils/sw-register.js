/**
 * @fileoverview Enregistrement et gestion du Service Worker PWA
 * @description Module de configuration PWA avec gestion des mises à jour automatiques
 * @version 1.0.0
 * @author Christophe Lecart <djlike@hotmail.fr>
 */

/**
 * Enregistre le Service Worker pour activer les fonctionnalités PWA
 * @function registerServiceWorker
 * @description Configure l'enregistrement SW avec gestion des mises à jour et notifications
 * @returns {void}
 * @example
 * // Activer le Service Worker PWA
 * registerServiceWorker();
 */
export function registerServiceWorker() {
  /**
   * Vérification de la compatibilité Service Worker
   * @description Teste le support du navigateur avant enregistrement
   */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        /**
         * Enregistrement du Service Worker principal
         * @description Chemin vers le fichier SW principal avec gestion d'erreurs
         */
        .register("/js/utils/service-worker.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );

          /**
           * Gestionnaire de détection des mises à jour
           * @description Écoute les nouveaux SW et déclenche les notifications
           */
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                showUpdateNotification();
              }
            });
          });
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    });
  }

  /**
   * Affiche une notification de mise à jour PWA
   * @function showUpdateNotification
   * @description Crée une notification interactive pour les mises à jour SW
   * @returns {void}
   * @example
   * // Déclenchée automatiquement lors de nouvelles versions
   * showUpdateNotification();
   */
  function showUpdateNotification() {
    const notification = document.createElement("div");
    notification.className = "app-update-notification";
    notification.innerHTML = `
      <p>Une nouvelle version est disponible !</p>
      <button id="update-app">Mettre à jour</button>
    `;
    document.body.appendChild(notification);

    /**
     * Gestionnaire de clic sur le bouton de mise à jour
     * @description Force l'activation du nouveau SW et recharge la page
     */
    document.getElementById("update-app").addEventListener("click", () => {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg.waiting) {
          reg.waiting.postMessage({ action: "skipWaiting" });
        }
      });
      notification.remove();
      window.location.reload();
    });
  }

  /**
   * Gestion automatique des changements de contrôleur SW
   * @description Évite les rechargements multiples lors des mises à jour
   */
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}
