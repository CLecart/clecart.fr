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
      projects[0].classList.add("active");
      if (navButtons.length > 0) {
        navButtons[0].classList.add("active");
      }
    }
  }

  function showProject(projectId) {
    projects.forEach((project) => project.classList.remove("active"));
    navButtons.forEach((button) => button.classList.remove("active"));

    const targetProject = document.getElementById(projectId);
    const targetButton = document.querySelector(
      `.nav-buttons a[href="#${projectId}"]`
    );

    if (targetProject) {
      targetProject.classList.add("active");
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
      const targetPosition =
        document.getElementById(targetId).getBoundingClientRect().top +
        window.pageYOffset;
      window.scrollTo({
        top: targetPosition - headerHeight - 20,
        behavior: "smooth",
      });
    });
  });

  showInitialProject();

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      showProject(hash.substring(1));
    }
  });
}
