/**
 * Module pour gérer les modales
 * Traite les ouvertures et fermetures des fenêtres modales
 */
export function initModals() {
  // Obtenir toutes les miniatures avec l'attribut title contenant "Click to enlarge"
  const thumbnails = document.querySelectorAll(
    '.project-thumb[title*="Click to enlarge"]'
  );

  // Créer la modale si elle n'existe pas déjà
  let modal = document.querySelector(".modal");

  if (!modal) {
    modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <span class="close">&times;</span>
      <img class="modal-content" id="modal-img">
    `;
    document.body.appendChild(modal);
  }

  const modalImg =
    document.getElementById("modal-img") ||
    modal.querySelector(".modal-content");
  const closeBtn = modal.querySelector(".close");

  // Ajouter des événements aux miniatures
  thumbnails.forEach((thumb) => {
    thumb.style.cursor = "pointer";

    thumb.addEventListener("click", function () {
      const img = this.querySelector("img");
      if (img) {
        modal.style.display = "block";
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        document.body.style.overflow = "hidden"; // Empêcher le défilement
      }
    });
  });

  // Fermer la modale lors du clic sur le bouton de fermeture
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // Fermer la modale lors du clic n'importe où sur la modale
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Fermer la modale avec la touche Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.style.display === "block") {
      closeModal();
    }
  });

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = ""; // Restaurer le défilement
  }
}
