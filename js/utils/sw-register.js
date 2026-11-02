/**
 * Service Worker registration
 * @author Christophe Lecart
 */

/**
 * Register the root-scoped worker, and offer a reload when a newer one installs
 * @function registerServiceWorker
 * @description Registers synchronously: main.js already calls this from a load
 * handler, and re-registering a load listener here would never fire — the DOM
 * does not invoke listeners added while the event they listen for is
 * dispatching, and load only happens once.
 * @returns {void}
 */
export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker
    .register("/service-worker.js")
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
    .catch((error) => {
      console.warn("Service Worker registration failed:", error);
    });
}

/**
 * Offer a reload once a newer worker has installed over a controlled page
 * @function showUpdateNotification
 * @description The worker skips waiting on install, so by the time the visitor clicks it already controls the page: the button only reloads, there is no waiting worker left to promote.
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
    notification.remove();
    globalThis.location.reload();
  });
}
