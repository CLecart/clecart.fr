/**
 * Module pour gérer la navigation entre projets
 */
export function initProjectNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const projectSections = document.querySelectorAll(".project.description");

  if (!navButtons.length || !projectSections.length) return;

  // Activer le bouton correspondant au hash actuel
  activateButtonFromHash();

  // Gérer les clics sur les boutons de navigation
  navButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      // Mettre à jour l'état actif des boutons
      navButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Mise à jour de l'URL sans rechargement
      const targetId = this.getAttribute("href");
      history.pushState(null, "", targetId);

      // Défiler jusqu'au projet
      scrollToProject(targetId);
    });
  });

  // Gérer la navigation par l'historique du navigateur
  window.addEventListener("popstate", () => {
    activateButtonFromHash();
    scrollToProject(window.location.hash);
  });

  /**
   * Fait défiler la page jusqu'au projet spécifié
   * @param {string} targetId - ID de l'élément cible
   */
  function scrollToProject(targetId) {
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      // Calculer la position en tenant compte du header fixe
      const headerHeight = document.querySelector("header").offsetHeight;
      const buffer = 20; // Espace supplémentaire pour l'esthétique

      window.scrollTo({
        top: targetElement.offsetTop - headerHeight - buffer,
        behavior: "smooth",
      });
    }
  }

  /**
   * Active le bouton correspondant au fragment d'URL actuel
   */
  function activateButtonFromHash() {
    const hash = window.location.hash;

    // Si pas de hash, activer le premier bouton
    if (!hash && navButtons.length > 0) {
      navButtons.forEach((btn) => btn.classList.remove("active"));
      navButtons[0].classList.add("active");
      return;
    }

    // Activer le bouton correspondant au hash actuel
    navButtons.forEach((button) => {
      button.classList.remove("active");
      if (button.getAttribute("href") === hash) {
        button.classList.add("active");
      }
    });
  }
}
