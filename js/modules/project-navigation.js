/**
 * Project navigation management
 * @author Christophe Lecart
 */

/**
 * Turn the project anchors into a hash-driven tab switcher
 * @function initProjectNavigation
 * @description A deep link opens a project only when the URL hash equals one of the tabs' own fragments. The hash is compared, never turned into a selector: "#1" is not valid CSS, and querySelector threw on it before any project was shown. Any other hash falls back to the first project, so the page is never left showing nothing.
 * @returns {void}
 */
export function initProjectNavigation() {
  const navButtons = [...document.querySelectorAll(".nav-btn")];
  const projects = document.querySelectorAll(".project");

  if (!navButtons.length || !projects.length) {
    return;
  }

  /**
   * Show one project and mark its tab, hiding every other project
   * @function activate
   * @description The active class is the whole switch: projects.css shows .project.active and hides every other .project.
   * @param {HTMLElement} project - Project to show
   * @param {HTMLElement} button - Tab to mark as active
   * @returns {void}
   */
  function activate(project, button) {
    projects.forEach((other) => other.classList.remove("active"));
    navButtons.forEach((btn) => btn.classList.remove("active"));

    project.classList.add("active");
    button.classList.add("active");
  }

  const projectOf = (button) =>
    document.getElementById(button.getAttribute("href").slice(1));

  const linkedButton = navButtons.find(
    (button) => button.hash === globalThis.location.hash
  );
  const linkedProject = linkedButton ? projectOf(linkedButton) : null;

  if (linkedProject) {
    activate(linkedProject, linkedButton);
  } else {
    activate(projects[0], navButtons[0]);
  }

  navButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      const targetProject = projectOf(button);
      if (targetProject) {
        activate(targetProject, button);
      }
    });
  });
}
