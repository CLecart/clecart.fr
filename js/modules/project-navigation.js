// project-navigation.js
// Module de gestion de la navigation entre les projets du portfolio

/**
 * Initialise la navigation entre les projets (boutons, affichage dynamique)
 */
export function initProjectNavigation() {
  // Sélection des boutons de navigation et des projets
  const navButtons = document.querySelectorAll(".nav-btn");
  const projects = document.querySelectorAll(".project");

  if (!navButtons.length) return;

  // Initialisation: afficher le premier projet par défaut
  function showInitialProject() {
    const hash = window.location.hash;

    // Si un hash est présent dans l'URL
    if (hash) {
      const targetProject = document.querySelector(hash);

      if (targetProject) {
        // Masquer tous les projets
        projects.forEach((project) => {
          project.style.display = "none";
          project.classList.remove("active");
        });

        // Afficher le projet cible
        targetProject.style.display = "block";
        targetProject.classList.add("active");

        // Mettre à jour les boutons
        navButtons.forEach((btn) => {
          btn.classList.remove("active");
          if (btn.getAttribute("href") === hash) {
            btn.classList.add("active");
          }
        });

        // Défiler vers le haut de la page
        window.scrollTo(0, 0);
      }
    } else {
      // Si pas de hash, afficher le premier projet
      if (projects.length > 0) {
        projects.forEach((p, index) => {
          if (index === 0) {
            p.style.display = "block";
            p.classList.add("active");
          } else {
            p.style.display = "none";
            p.classList.remove("active");
          }
        });

        if (navButtons.length > 0) {
          navButtons[0].classList.add("active");
        }
      }
    }
  }

  // Exécuter l'initialisation
  showInitialProject();

  // Gestion du clic sur les boutons pour afficher le projet correspondant
  navButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      // Mettre à jour l'état des boutons
      navButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Récupérer l'ID du projet cible
      const targetId = this.getAttribute("href");
      const targetProject = document.querySelector(targetId);

      // Masquer tous les projets sauf celui ciblé
      projects.forEach((project) => {
        project.style.display = "none";
        project.classList.remove("active");
      });

      if (targetProject) {
        targetProject.style.display = "block";
        targetProject.classList.add("active");
      }

      // Mettre à jour l'URL sans recharger la page
      history.pushState(null, null, targetId);

      // Défiler vers le haut de la page
      window.scrollTo(0, 0);
    });
  });

  // Écouter les changements de hash (navigation par historique)
  window.addEventListener("hashchange", showInitialProject);
}
