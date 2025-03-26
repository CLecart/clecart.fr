/**
 * Module minimaliste pour optimisations de performance
 */
export function initPerformanceOptimizations() {
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
}
