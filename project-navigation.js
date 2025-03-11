// Script pour gérer la navigation entre projets dans descriptions-projects.html

document.addEventListener("DOMContentLoaded", function () {
  // Référence au titre du projet actuel
  const titleElement = document.getElementById("project-title");

  // Table de correspondance des titres de projet
  const projectTitles = {
    project1: "Groupie Tracker",
    project2: "Bomberman",
    project3: "Forum",
  };

  // Fonction pour afficher un projet spécifique
  function showProject(projectId) {
    // Masquer tous les projets
    document.querySelectorAll(".project").forEach((project) => {
      project.classList.remove("active");
    });

    // Afficher le projet sélectionné
    const selectedProject = document.getElementById(projectId);
    if (selectedProject) {
      selectedProject.classList.add("active");

      // Mettre à jour le titre de la page
      if (titleElement && projectTitles[projectId]) {
        titleElement.textContent = projectTitles[projectId];
      }

      // Remonter en haut de la page, avec un délai pour s'assurer que le DOM est mis à jour
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  }

  // Fonction pour gérer la navigation par ancre d'URL
  function handleProjectNavigation() {
    // Récupérer l'ancre dans l'URL
    const hash = window.location.hash.substring(1);

    // Si une ancre existe et correspond à un projet, l'afficher
    if (hash && ["project1", "project2", "project3"].includes(hash)) {
      showProject(hash);
    }
  }

  // Attacher la navigation aux boutons si présents
  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const projectId = this.getAttribute("href").substring(1);
      showProject(projectId);
      window.history.pushState(null, null, `#${projectId}`);
    });
  });

  // Gérer la navigation initiale
  handleProjectNavigation();

  // Écouter les changements d'URL
  window.addEventListener("hashchange", handleProjectNavigation);

  // Exposer la fonction showProject globalement pour une utilisation externe
  window.showProject = showProject;
});
