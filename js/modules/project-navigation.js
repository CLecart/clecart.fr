/**
 * Project navigation management
 * @author Christophe Lecart
 */

export function initProjectNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const projects = document.querySelectorAll(".project");

  if (!navButtons.length || !projects.length) return;

  // Hide all projects and remove active classes first
  projects.forEach((project) => {
    project.classList.remove("active");
    project.style.display = "none";
  });
  navButtons.forEach((btn) => btn.classList.remove("active"));

  // Check for hash in URL to show the correct project
  const hash = window.location.hash;
  let activeProject = null;
  let activeButton = null;

  if (hash) {
    activeProject = document.querySelector(hash);
    activeButton = document.querySelector(`a[href="${hash}"]`);
  }

  // If no hash or invalid hash, default to first project
  if (!activeProject) {
    activeProject = projects[0];
    activeButton = navButtons[0];
  }

  if (activeProject) {
    activeProject.classList.add("active");
    activeProject.style.display = "block";
  }
  if (activeButton) activeButton.classList.add("active");

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
