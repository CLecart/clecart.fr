/**
 * Module pour la navigation entre projets
 * @function initProjectNavigation - Configure la navigation entre projets
 */
export function initProjectNavigation() {
  const navButtons = document.querySelectorAll(".nav-buttons a");
  const projects = document.querySelectorAll(".project");

  /**
   * Affiche le projet initial basé sur le hash URL ou le premier projet
   * @function showInitialProject
   */
  function showInitialProject() {
    const hash = window.location.hash;
    let shown = false;

    // Vérifier si le hash correspond à un projet
    if (hash && hash.length > 1) {
      const targetProject = document.querySelector(hash);
      if (targetProject && targetProject.classList.contains("project")) {
        showProject(hash.substring(1));
        shown = true;
      }
    }

    // Afficher le premier projet si aucun n'est spécifié
    if (!shown && projects.length > 0) {
      projects.forEach((p) => {
        p.style.display = "none";
        p.classList.remove("active");
      });

      projects[0].style.display = "block";
      projects[0].classList.add("active");

      if (navButtons.length > 0) {
        navButtons[0].classList.add("active");
      }
    }
  }

  function showProject(projectId) {
    // Hide all projects
    projects.forEach((project) => {
      project.style.display = "none";
      project.classList.remove("active");
    });

    // Remove active class from all buttons
    navButtons.forEach((button) => {
      button.classList.remove("active");
    });

    // Show the target project
    const targetProject = document.getElementById(projectId);
    const targetButton = document.querySelector(
      `.nav-buttons a[href="#${projectId}"]`
    );

    if (targetProject) {
      targetProject.style.display = "block";
      targetProject.classList.add("active");

      // Ensure the project is visible with animation
      setTimeout(() => {
        targetProject.style.opacity = "1";
      }, 50);
    }

    if (targetButton) {
      targetButton.classList.add("active");
    }
  }

  navButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = button.getAttribute("href").substring(1);
      showProject(targetId);

      history.pushState(null, null, `#${targetId}`);

      // Correction de l'offset de défilement
      const headerHeight = document.querySelector("header").offsetHeight;
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // Utiliser un plus grand buffer pour s'assurer que le contenu commence plus haut
        const buffer = window.innerWidth <= 768 ? 25 : 40;

        window.scrollTo({
          top: targetElement.offsetTop - headerHeight - buffer,
          behavior: "smooth",
        });
      }
    });
  });

  // Initialiser la visibilité des projets et gérer les changements d'URL
  showInitialProject();

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      showProject(hash.substring(1));
    }
  });
}
