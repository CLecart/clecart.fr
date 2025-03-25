/**
 * Enregistrement du Service Worker pour fonctionnalités PWA
 */
export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        // Mettre à jour le chemin vers le service worker
        .register("/js/utils/service-worker.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );

          // Vérifier les mises à jour
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

  // Notification de mise à jour
  function showUpdateNotification() {
    const notification = document.createElement("div");
    notification.className = "app-update-notification";
    notification.innerHTML = `
      <p>Une nouvelle version est disponible !</p>
      <button id="update-app">Mettre à jour</button>
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

  // Gérer les mises à jour du service worker
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}
