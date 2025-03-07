// Script ultra-simple pour la visionneuse d'images

document.addEventListener("DOMContentLoaded", function () {
  // Créer la modal
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <span class="close">&times;</span>
    <img class="modal-content" id="expandedImg">
  `;
  document.body.appendChild(modal);

  const expandedImg = document.getElementById("expandedImg");
  const closeBtn = modal.querySelector(".close");

  // Ajouter les écouteurs d'événements sur les images
  document.querySelectorAll(".project-thumb img").forEach((img) => {
    img.addEventListener("click", function () {
      modal.style.display = "block";
      expandedImg.src = this.src;
    });
  });

  // Fermer la modal
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
