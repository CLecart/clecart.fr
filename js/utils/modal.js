/**
 * Module pour gérer les fenêtres modales
 */
export function initModals() {
  // Créer une modal pour les images des projets
  document.querySelectorAll(".project-thumb img").forEach((image) => {
    image.addEventListener("click", function () {
      createImageModal(this.src, this.alt);
    });
  });

  function createImageModal(src, alt) {
    // Vérifier si une modal existe déjà et la supprimer
    const existingModal = document.querySelector(".modal-overlay");
    if (existingModal) {
      existingModal.remove();
    }

    // Créer les éléments de la modal
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

    // Assembler la modal
    modalContent.appendChild(modalImage);
    modalContent.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Ajouter l'animation
    setTimeout(() => {
      modalOverlay.classList.add("active");
    }, 10);

    // Gérer la fermeture
    closeButton.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    // Fermeture avec la touche Echap
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeModal();
      }
    });

    function closeModal() {
      modalOverlay.classList.remove("active");
      setTimeout(() => {
        modalOverlay.remove();
      }, 300);
    }
  }
}
