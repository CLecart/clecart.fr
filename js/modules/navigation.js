/**
 * Module pour la navigation et le menu mobile
 */
export function initNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("nav ul");
  const menuIcon = navToggle ? navToggle.querySelector("i") : null;

  if (navToggle && navMenu) {
    // Initialisation correcte du menu
    navMenu.classList.remove("active");

    // Forcer un style initial pour éviter les problèmes de visibilité
    if (window.innerWidth <= 768) {
      // S'assurer que les liens ont la bonne couleur à l'initialisation
      document.querySelectorAll("nav ul li a").forEach((link) => {
        if (document.body.classList.contains("dark-mode")) {
          link.style.color = "var(--text-dark)";
        } else {
          link.style.color = "var(--text-color)";
        }
      });
    }

    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");

      if (menuIcon) {
        menuIcon.className = navMenu.classList.contains("active")
          ? "fas fa-times"
          : "fas fa-bars";
      }

      // Corriger la visibilité lors du clic
      if (navMenu.classList.contains("active")) {
        navMenu.style.visibility = "visible";
        navMenu.style.opacity = "1";
      }
    });

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll("nav ul li a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          navMenu.classList.remove("active");
          if (menuIcon) {
            menuIcon.className = "fas fa-bars";
          }
        }
      });
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 768 &&
        navMenu.classList.contains("active") &&
        !e.target.closest("nav") &&
        !e.target.closest(".nav-toggle")
      ) {
        navMenu.classList.remove("active");
        if (menuIcon) {
          menuIcon.className = "fas fa-bars";
        }
      }
    });
  }

  document
    .querySelectorAll('a[href^="#"]:not([href="#"])')
    .forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
        }
      });
    });

  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}
