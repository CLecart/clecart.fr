/**
 * Module de navigation entre projets
 * @module project-navigation
 */
export function initProjectNavigation() {
  const projectTitles = {
    project1: "Groupie Tracker",
    project2: "Bomberman",
    project3: "Forum",
  };

  /**
   * Affiche un projet spécifique et masque les autres
   * @param {string} projectId - ID du projet à afficher
   */
  function showProject(projectId) {
    document.querySelectorAll(".project").forEach((project) => {
      project.classList.remove("active");
    });

    const selectedProject = document.getElementById(projectId);
    if (selectedProject) {
      selectedProject.classList.add("active");

      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  }

  function handleProjectNavigation() {
    const hash = window.location.hash.substring(1);
    if (hash && ["project1", "project2", "project3"].includes(hash)) {
      showProject(hash);
    }
  }

  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const projectId = this.getAttribute("href").substring(1);
      showProject(projectId);
      window.history.pushState(null, null, `#${projectId}`);
    });
  });

  handleProjectNavigation();
  window.addEventListener("hashchange", handleProjectNavigation);
}
