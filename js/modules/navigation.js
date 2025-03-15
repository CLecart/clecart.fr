/**
 * Module pour la navigation et le menu mobile
 */
export function initNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("nav ul");
  const menuIcon = navToggle?.querySelector("i");
  const header = document.querySelector("header");

  if (!navToggle || !navMenu) return;

  // Initialisation du menu
  navMenu.classList.remove("active");

  // Gestion de la largeur du menu mobile
  function setMenuWidth() {
    if (window.innerWidth <= 768 && navMenu.classList.contains("active")) {
      let maxWidth = Array.from(navMenu.querySelectorAll("li a")).reduce(
        (width, link) => Math.max(width, link.offsetWidth),
        0
      );

      navMenu.style.width = `${maxWidth + 40}px`;
    } else {
      navMenu.style.width = "";
    }
  }

  // Toggle du menu mobile
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    if (menuIcon) {
      menuIcon.className = navMenu.classList.contains("active")
        ? "fas fa-times"
        : "fas fa-bars";
    }

    if (navMenu.classList.contains("active")) {
      navMenu.style.visibility = "visible";
      navMenu.style.opacity = "1";
      setMenuWidth();
    }
  });

  // Fermeture du menu au clic sur un lien
  document.querySelectorAll("nav ul li a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navMenu.classList.remove("active");
        if (menuIcon) menuIcon.className = "fas fa-bars";
      }
    });
  });

  // Fermeture du menu au clic à l'extérieur
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 768 &&
      navMenu.classList.contains("active") &&
      !e.target.closest("nav") &&
      !e.target.closest(".nav-toggle")
    ) {
      navMenu.classList.remove("active");
      if (menuIcon) menuIcon.className = "fas fa-bars";
    }
  });

  // Défilement fluide pour les ancres
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

  // Classe scrolled pour le header
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Ajustement du menu au redimensionnement
  window.addEventListener("resize", setMenuWidth);
}
