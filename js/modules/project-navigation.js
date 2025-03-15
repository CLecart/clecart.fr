/**
 * Module pour la navigation entre les projets
 */
export function initProjectNavigation() {
  // Mapping des IDs vers les titres de projet
  const projectTitles = {
    project1: "Groupie Tracker",
    project2: "Bomberman",
    project3: "Forum",
  };

  /**
   * Affiche un projet spécifique et masque les autres
   * @param {string} projectId - L'ID du projet à afficher
   */
  function showProject(projectId) {
    // Masquer tous les projets
    document.querySelectorAll(".project").forEach((project) => {
      project.classList.remove("active");
    });

    // Afficher le projet sélectionné
    const selectedProject = document.getElementById(projectId);
    if (selectedProject) {
      selectedProject.classList.add("active");

      // Défilement en douceur vers le haut
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  }

  /**
   * Gère la navigation basée sur l'ancre dans l'URL
   */
  function handleProjectNavigation() {
    const hash = window.location.hash.substring(1);
    if (hash && ["project1", "project2", "project3"].includes(hash)) {
      showProject(hash);
    }
  }

  // Attacher les événements aux boutons de navigation
  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const projectId = this.getAttribute("href").substring(1);
      showProject(projectId);
      window.history.pushState(null, null, `#${projectId}`);
    });
  });

  // Initialisation et gestion des événements
  handleProjectNavigation();
  window.addEventListener("hashchange", handleProjectNavigation);
}
