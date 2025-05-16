// performance.js
// Module utilitaire pour les optimisations de performance (lazy loading, etc.)

/**
 * Initialise les optimisations de performance du site
 */
export function initPerformanceOptimizations() {
  // Lazy loading des images et vidéos

  // Optimisation pour les connexions lentes
  if ("connection" in navigator) {
    const connection = navigator.connection;

    if (
      connection &&
      (connection.saveData ||
        ["slow-2g", "2g", "3g"].includes(connection.effectiveType))
    ) {
      // Seulement optimiser le préchargement des vidéos
      document.querySelectorAll("video").forEach((video) => {
        if (video.preload === "auto") {
          video.preload = "metadata";
        }
      });
    }
  }

  // Préchargement des ressources critiques
}
