/**
 * @fileoverview Module utilitaire pour les optimisations de performance
 * @description Gère le lazy loading, l'optimisation réseau et le préchargement des ressources
 * @version 1.0.0
 * @author Christophe Lecart <djlike@hotmail.fr>
 */

/**
 * Initialise les optimisations de performance adaptées à la connexion utilisateur
 * @function initPerformanceOptimizations
 * @description Optimise automatiquement le chargement selon la qualité de connexion détectée
 * @returns {void}
 * @example
 * // Activer les optimisations performance
 * initPerformanceOptimizations();
 *
 * @see {@link https://developer.mozilla.org/docs/Web/API/Network_Information_API} Network Information API
 */
export function initPerformanceOptimizations() {
  /**
   * Détection et optimisation pour les connexions lentes
   * @description Utilise l'API Network Information pour adapter les performances
   */
  if ("connection" in navigator) {
    const connection = navigator.connection;

    /**
     * Conditions de connexion lente détectées
     * @type {boolean}
     * @description Vérifie saveData ou type de connexion 2G/3G
     */
    if (
      connection &&
      (connection.saveData ||
        ["slow-2g", "2g", "3g"].includes(connection.effectiveType))
    ) {
      /**
       * Optimisation du préchargement vidéo pour connexions lentes
       * @description Change preload="auto" vers preload="metadata" pour économiser la bande passante
       */
      document.querySelectorAll("video").forEach((video) => {
        if (video.preload === "auto") {
          video.preload = "metadata";
        }
      });
    }
  }

  /**
   * @todo Implémenter le préchargement intelligent des ressources critiques
   * @description Précharger les assets selon la priorité et la connexion
   */
}
