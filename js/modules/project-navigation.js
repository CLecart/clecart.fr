/**
 * Project navigation management
 * @author Christophe Lecart
 */

/**
 * Turn the project anchors into a hash-driven tab switcher
 * @function initProjectNavigation
 * @description A deep link opens the project named by the URL hash; an unmatched or absent hash falls back to the first project, so the page is never left showing nothing. Every project is reset to inactive up front, which makes the function safe to run over markup already in an arbitrary state.
 * @returns {void}
 */
export function initProjectNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const projects = document.querySelectorAll(".project");

  if (!navButtons.length || !projects.length) {
    return;
  }

  projects.forEach((project) => {
    project.classList.remove("active");
    project.style.display = "none";
  });
  navButtons.forEach((btn) => btn.classList.remove("active"));

  const hash = globalThis.location.hash;
  let activeProject = null;
  let activeButton = null;

  if (hash) {
    activeProject = document.querySelector(hash);
    activeButton = document.querySelector(`a[href="${hash}"]`);
  }

  if (!activeProject) {
    activeProject = projects[0];
    activeButton = navButtons[0];
  }

  if (activeProject) {
    activeProject.classList.add("active");
    activeProject.style.display = "block";
  }
  if (activeButton) {
    activeButton.classList.add("active");
  }

  navButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = button.getAttribute("href");
      const targetProject = document.querySelector(targetId);

      if (targetProject) {
        projects.forEach((project) => {
          project.classList.remove("active");
          project.style.display = "none";
        });

        navButtons.forEach((btn) => btn.classList.remove("active"));

        targetProject.classList.add("active");
        targetProject.style.display = "block";
        button.classList.add("active");
      }
    });
  });
}
