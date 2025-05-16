// modal.js
// Module utilitaire pour la gestion des modales (ouvertures, fermetures, animations)

/**
 * Initialise la gestion des modales sur le site
 */
export function initModals() {
  // Sélection des éléments déclencheurs et des modales
  document.querySelectorAll(".project-thumb img").forEach((image) => {
    image.addEventListener("click", function () {
      createImageModal(this.src, this.alt);
    });
  });

  /**
   * Crée et affiche une modale d'image
   * @param {string} src - L'URL de l'image
   * @param {string} alt - Le texte alternatif de l'image
   */
  function createImageModal(src, alt) {
    // Vérifie et supprime une modale existante
    const existingModal = document.querySelector(".modal-overlay");
    if (existingModal) {
      existingModal.remove();
    }

    // Création des éléments de la modale
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

    // Ajout des éléments à la modale
    modalContent.appendChild(modalImage);
    modalContent.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Animation d'apparition
    setTimeout(() => {
      modalOverlay.classList.add("active");
    }, 10);

    // Gestion de la fermeture des modales
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
     * Ferme et supprime la modale
     */
    function closeModal() {
      modalOverlay.classList.remove("active");
      setTimeout(() => {
        modalOverlay.remove();
      }, 300);
    }
  }
}
