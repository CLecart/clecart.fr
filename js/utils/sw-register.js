/**
 * Service Worker registration
 * @author Christophe Lecart
 */

/* Media are left to the browser by the worker; their URLs are not worth sending. */
const NOT_CACHED = new Set(["video", "audio", "track"]);

/**
 * Register the root-scoped worker, and offer a reload when a newer one installs
 * @function registerServiceWorker
 * @description Registers synchronously: main.js already calls this from a load
 * handler, and re-registering a load listener here would never fire — the DOM
 * does not invoke listeners added while the event they listen for is
 * dispatching, and load only happens once. A page that loaded without a worker
 * in control sends it, once it is active, the list of what it fetched.
 * @returns {void}
 */
export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const controlled = Boolean(navigator.serviceWorker.controller);

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
      return controlled ? null : navigator.serviceWorker.ready;
    })
    .then((ready) => {
      ready?.active?.postMessage({ type: "cache-loaded", urls: loadedUrls() });
    })
    .catch((error) => {
      console.warn("Service Worker registration failed:", error);
    });
}

/**
 * List what this page loaded, so a worker that did not see it load can store it
 * @function loadedUrls
 * @description The worker caches responses as they pass, but the visit that installs it, or a reload that bypasses it, went straight to the network. Resource Timing already holds the answer — the page itself, every stylesheet import, module, font and icon it fetched — so no hand-kept list has to follow the site's files.
 * @returns {string[]} The page's own URL, without its query or fragment, then each resource it fetched
 */
function loadedUrls() {
  const { origin, pathname } = globalThis.location;
  const page = `${origin}${pathname}`;
  const resources = performance
    .getEntriesByType("resource")
    .filter((entry) => !NOT_CACHED.has(entry.initiatorType))
    .map((entry) => entry.name);
  return [page, ...resources];
}

/**
 * Offer a reload once a newer worker has installed over a controlled page
 * @function showUpdateNotification
 * @description The worker skips waiting on install, so by the time the visitor clicks it already controls the page: the button only reloads, there is no waiting worker left to promote. One notice at most: a second update while the first is still shown changes nothing it says.
 * @returns {void}
 */
function showUpdateNotification() {
  if (document.querySelector(".app-update-notification")) {
    return;
  }

  const notification = document.createElement("div");
  notification.className = "app-update-notification";
  notification.setAttribute("role", "status");
  document.body.appendChild(notification);

  /* Filled once the live region is in the page: a region inserted with its
     text already inside is not announced by every screen reader. */
  requestAnimationFrame(() => {
    notification.innerHTML = `
      <p>New version available!</p>
      <button type="button">Update</button>
    `;
    notification.querySelector("button").addEventListener("click", () => {
      notification.remove();
      globalThis.location.reload();
    });
  });
}
