/**
 * Service Worker registration and PWA management
 * @fileoverview Handles service worker registration with update notifications
 * @author Christophe Lecart
 */

/**
 * Registers the service worker for PWA functionality
 * @function registerServiceWorker
 * @description Configures service worker registration with automatic update handling
 * @returns {void}
 */
export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/js/utils/service-worker.js")
        .then((registration) => {
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
        .catch(() => {
          // Service Worker registration failed
        });
    });
  }

  /**
   * Shows update notification when new service worker version is available
   * @function showUpdateNotification
   * @description Creates interactive notification for service worker updates
   * @returns {void}
   */
  function showUpdateNotification() {
    const notification = document.createElement("div");
    notification.className = "app-update-notification";
    notification.innerHTML = `
      <p>New version available!</p>
      <button id="update-app">Update</button>
    `;
    document.body.appendChild(notification);

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
   * Prevents multiple reloads during service worker updates
   * @description Handles controller change events with refresh guard
   */
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}
