/**
 * Module pour les optimisations de performance
 * Version minimaliste qui n'affecte pas l'apparence du site
 */
export function initPerformanceOptimizations() {
  // Détection de connexion lente
  if ("connection" in navigator) {
    const connection = navigator.connection;

    // Optimisations pour les connexions lentes
    if (
      connection &&
      (connection.saveData ||
        ["slow-2g", "2g", "3g"].includes(connection.effectiveType))
    ) {
      // Optimiser le chargement des vidéos sur connexion lente
      document.querySelectorAll("video").forEach((video) => {
        if (video.preload === "auto") {
          video.preload = "metadata";
        }
      });
    }
  }

  // Préchargement des pages au survol (sans impact visuel)
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      document
        .querySelectorAll('a[href^="/"]:not([href^="#"]):not([target])')
        .forEach((link) => {
          link.addEventListener("mouseenter", () => {
            const href = link.getAttribute("href");
            if (!href || href === "/") return;

            if (
              !document.querySelector(`link[rel="prefetch"][href="${href}"]`)
            ) {
              const prefetch = document.createElement("link");
              prefetch.rel = "prefetch";
              prefetch.href = href;
              document.head.appendChild(prefetch);
            }
          });
        });
    });
  }
}
