// Script pour gérer l'agrandissement des images
document.addEventListener("DOMContentLoaded", function () {
  // Créer la modal une seule fois
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <span class="close">&times;</span>
    <img class="modal-content" id="expandedImg">
  `;
  document.body.appendChild(modal);

  // Récupérer les éléments
  const expandedImg = document.getElementById("expandedImg");
  const closeModal = modal.querySelector(".close");

  // Ajouter des écouteurs d'événements à toutes les images de projet
  const projectThumbs = document.querySelectorAll(".project-thumb");
  projectThumbs.forEach((thumb) => {
    thumb.addEventListener("click", function () {
      // Vérifier si c'est une image ou une vidéo
      const mediaElement =
        this.querySelector("img") || this.querySelector("video");
      if (mediaElement) {
        modal.style.display = "flex";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";

        if (mediaElement.tagName === "IMG") {
          // Si c'est une image
          expandedImg.src = mediaElement.src;
          expandedImg.style.display = "block";
        }
      }
    });
  });

  // Fermer la modal quand on clique sur X
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Fermer la modal quand on clique n'importe où
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Fermer la modal avec Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.style.display === "flex") {
      modal.style.display = "none";
    }
  });
});
