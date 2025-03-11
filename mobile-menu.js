/**
 * Script dédié uniquement au menu mobile
 * Isolé pour éviter les conflits avec d'autres scripts
 */
document.addEventListener("DOMContentLoaded", function () {
  // Sélectionner les éléments du menu
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("nav ul");

  // Vérifier si les éléments existent
  if (!navToggle || !navMenu) {
    console.error("Menu elements not found");
    return;
  }

  // Fonction pour ouvrir/fermer le menu
  function toggleMenu() {
    navMenu.classList.toggle("active");
    console.log("Menu toggled", navMenu.classList.contains("active"));
  }

  // Écouteur d'événement pour le bouton hamburger
  navToggle.addEventListener("click", function (event) {
    event.stopPropagation(); // Empêcher la propagation
    toggleMenu();
  });

  // Fermer le menu lors d'un clic sur un lien
  navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navMenu.classList.remove("active");
    });
  });

  // Fermer le menu lors d'un clic en dehors
  document.addEventListener("click", function (event) {
    const isClickInsideMenu = navMenu.contains(event.target);
    const isClickOnToggle = navToggle.contains(event.target);

    if (
      !isClickInsideMenu &&
      !isClickOnToggle &&
      navMenu.classList.contains("active")
    ) {
      navMenu.classList.remove("active");
    }
  });
});
