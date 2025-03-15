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

    // Assurer que le menu a une largeur appropriée
    function setMenuWidth() {
      if (window.innerWidth <= 768) {
        // Trouver l'élément le plus large
        let maxWidth = 0;
        navMenu.querySelectorAll("li a").forEach((link) => {
          const computedWidth = link.offsetWidth;
          if (computedWidth > maxWidth) {
            maxWidth = computedWidth;
          }
        });

        // Ajouter un padding pour l'esthétique
        navMenu.style.width = maxWidth + 40 + "px";
      } else {
        navMenu.style.width = "";
      }
    }

    // S'assurer que les liens ont la bonne couleur à l'initialisation
    if (window.innerWidth <= 768) {
      document.querySelectorAll("nav ul li a").forEach((link) => {
        if (document.body.classList.contains("dark-mode")) {
          link.style.color = "var(--text-dark)";
        } else {
          link.style.color = "var(--text-color)";
        }
      });

      // Définir la largeur appropriée
      setTimeout(setMenuWidth, 100);
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

        // Ajuster la largeur lors de l'ouverture
        setMenuWidth();
      }
    });

    // Ajuster la largeur lors du redimensionnement
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 768 && navMenu.classList.contains("active")) {
        setMenuWidth();
      } else {
        navMenu.style.width = "";
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
