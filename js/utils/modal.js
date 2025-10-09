/**
 * @fileoverview Accessible modal management module
 * @description Handles modal opening, closing and animations with accessibility support
 * @version 1.0.0
 * @author Christophe Lecart <djlike@hotmail.fr>
 */

/**
 * Initialize modal system for project images
 * @function initModals
 * @description Configure les event listeners pour l'ouverture des modales d'images
 * @returns {void}
 * @example
 * // Activer les modales sur les images de projet
 * initModals();
 */
export function initModals() {
  /**
   * Modal trigger configuration on project thumbnails
   * @description Ajoute des event listeners de clic sur toutes les images de projets
   */
  document.querySelectorAll(".project-thumb img").forEach((image) => {
    image.addEventListener("click", function () {
      createImageModal(this.src, this.alt);
    });
  });

  /**
   * Crée et affiche une modale d'image avec animations et accessibilité
   * @function createImageModal
   * @param {string} src - URL de l'image à afficher dans la modale
   * @param {string} alt - Texte alternatif de l'image pour l'accessibilité
   * @returns {void}
   * @description Génère dynamiquement une modale accessible avec contrôles de fermeture
   * @example
   * // Ouvrir une modale d'image
   * createImageModal('/assets/images/project.jpg', 'Capture du projet');
   */
  function createImageModal(src, alt) {
    /**
     * Nettoyage des modales existantes pour éviter les conflits
     * @description Supprime toute modale déjà ouverte avant d'en créer une nouvelle
     */
    const existingModal = document.querySelector(".modal-overlay");
    if (existingModal) {
      existingModal.remove();
    }

    /**
     * Création de la structure DOM de la modale
     * @description Construit les éléments overlay, contenu, image et bouton de fermeture
     */
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const modalImage = document.createElement("img");
    modalImage.src = src;
    modalImage.alt = alt || "Project Image";

    const closeButton = document.createElement("button");
    closeButton.className = "modal-close";
    closeButton.innerHTML = "&times;";
    closeButton.setAttribute("aria-label", "Close modal");

    /**
     * Assemblage et injection de la modale dans le DOM
     * @description Construit la hiérarchie complète et l'ajoute au body
     */
    modalContent.appendChild(modalImage);
    modalContent.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    /**
     * Animation d'apparition avec délai pour le rendu CSS
     * @description Petite temporisation pour permettre le calcul des styles
     */
    setTimeout(() => {
      modalOverlay.classList.add("active");
    }, 10);

    /**
     * Modal close handlers configuration
     * @description Multiple méthodes de fermeture pour une meilleure UX
     */
    closeButton.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeModal();
      }
    });

    /**
     * Ferme la modale avec animation de sortie
     * @function closeModal
     * @description Anime la fermeture puis supprime l'élément du DOM
     * @returns {void}
     */
    function closeModal() {
      modalOverlay.classList.remove("active");
      setTimeout(() => {
        modalOverlay.remove();
      }, 300);
    }
  }
}
