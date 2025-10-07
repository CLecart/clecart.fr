/**
 * Project navigation management
 * @author Christophe Lecart
 */

export function initProjectNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const projects = document.querySelectorAll(".project");

  if (!navButtons.length || !projects.length) return;

  projects.forEach((project) => project.classList.remove("active"));
  navButtons.forEach((btn) => btn.classList.remove("active"));

  if (projects[0]) projects[0].classList.add("active");
  if (navButtons[0]) navButtons[0].classList.add("active");

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
