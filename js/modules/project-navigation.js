/**
 * Module pour la navigation entre projets
 */
export function initProjectNavigation() {
  const navButtons = document.querySelectorAll(".nav-buttons a");
  const projects = document.querySelectorAll(".project");

  function showInitialProject() {
    const hash = window.location.hash;
    let shown = false;

    if (hash && hash.length > 1) {
      const targetProject = document.querySelector(hash);
      if (targetProject && targetProject.classList.contains("project")) {
        showProject(hash.substring(1));
        shown = true;
      }
    }

    if (!shown && projects.length > 0) {
      // Hide all projects first
      projects.forEach((p) => {
        p.style.display = "none";
        p.classList.remove("active");
      });

      // Show only the first project
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

      const headerHeight = document.querySelector("header").offsetHeight;
      window.scrollTo({
        top:
          document.querySelector(".project-navigation").offsetTop -
          headerHeight,
        behavior: "smooth",
      });
    });
  });

  // Initialize project visibility
  showInitialProject();

  // Handle hash changes (e.g., from back button)
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      showProject(hash.substring(1));
    }
  });
}
