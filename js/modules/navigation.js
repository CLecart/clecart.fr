// navigation.js
// Module de gestion de la navigation principale et du menu responsive

/**
 * Initialise la navigation principale et le menu mobile
 */
export function initNavigation() {
  // Constante pour la durée de transition du menu - facilite la maintenance
  const MENU_TRANSITION_DURATION = 300;

  // Sélection des éléments du menu et du bouton toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("nav ul");
  const menuIcon = navToggle?.querySelector("i");
  const header = document.querySelector("header");

  if (!navToggle || !navMenu) return;

  navMenu.classList.remove("active");

  if (window.innerWidth <= 768) {
    navMenu.style.visibility = "hidden";
  }

  function setMenuWidth() {
    if (window.innerWidth <= 768 && navMenu.classList.contains("active")) {
      let maxWidth = Array.from(navMenu.querySelectorAll("li a")).reduce(
        (width, link) => Math.max(width, link.scrollWidth + 30),
        0
      );

      navMenu.style.width = `${Math.max(maxWidth, 180)}px`;
    } else {
      navMenu.style.width = "";
    }
  }

  // Gestion de l'ouverture/fermeture du menu mobile
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    if (menuIcon) {
      menuIcon.className = navMenu.classList.contains("active")
        ? "fas fa-times"
        : "fas fa-bars";
    }

    if (navMenu.classList.contains("active")) {
      navMenu.style.visibility = "visible";
      setMenuWidth();

      const headerHeight = document.querySelector("header").offsetHeight;
      navMenu.style.top = `${headerHeight + 5}px`;
    } else {
      setTimeout(() => {
        if (!navMenu.classList.contains("active")) {
          navMenu.style.visibility = "hidden";
        }
      }, MENU_TRANSITION_DURATION);
    }
  });

  // Gestion de l'activation des liens de navigation
  document.querySelectorAll("nav ul li a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navMenu.classList.remove("active");
        if (menuIcon) menuIcon.className = "fas fa-bars";

        setTimeout(() => {
          if (!navMenu.classList.contains("active")) {
            navMenu.style.visibility = "hidden";
          }
        }, MENU_TRANSITION_DURATION);
      }
    });
  });

  // Fermeture du menu lors de la navigation sur mobile
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 768 &&
      navMenu.classList.contains("active") &&
      !e.target.closest("nav") &&
      !e.target.closest(".nav-toggle")
    ) {
      navMenu.classList.remove("active");
      if (menuIcon) menuIcon.className = "fas fa-bars";

      setTimeout(() => {
        if (!navMenu.classList.contains("active")) {
          navMenu.style.visibility = "hidden";
        }
      }, MENU_TRANSITION_DURATION);
    }
  });

  window.addEventListener("resize", () => {
    setMenuWidth();

    if (window.innerWidth > 768) {
      navMenu.style.visibility = "visible";
    } else if (!navMenu.classList.contains("active")) {
      navMenu.style.visibility = "hidden";
    }
  });

  document
    .querySelectorAll('a[href^="#"]:not([href="#"])')
    .forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          document.documentElement.classList.add("scrolling-in-progress");

          document.querySelectorAll("nav a").forEach((link) => {
            link.classList.remove("active");
            link.setAttribute("tabindex", "-1");
          });
          this.classList.add("active");

          const headerHeight = document.querySelector("header").offsetHeight;
          const targetPosition =
            targetElement.getBoundingClientRect().top + window.pageYOffset;
          const buffer = window.innerWidth <= 768 ? 15 : 25;

          smoothScrollTo(
            window.pageYOffset,
            targetPosition - headerHeight - buffer,
            600
          );

          setTimeout(() => {
            document.documentElement.classList.remove("scrolling-in-progress");
            document.querySelectorAll("nav a").forEach((link) => {
              link.removeAttribute("tabindex");
            });
          }, 650);
        }
      });
    });

  function smoothScrollTo(startY, endY, duration) {
    const startTime = performance.now();
    const difference = endY - startY;

    function scroll(timestamp) {
      const timeElapsed = timestamp - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeInOutCubic =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY + difference * easeInOutCubic);

      if (timeElapsed < duration) {
        requestAnimationFrame(scroll);
      }
    }

    requestAnimationFrame(scroll);
  }

  window.addEventListener("resize", setMenuWidth);

  /**
   * Gestion propre des transitions de page selon les meilleures pratiques
   * @description Utilise la View Transitions API quand disponible, sinon fallback élégant
   */
  function initPageTransitions() {
    // Détection des liens internes
    document.addEventListener("click", function (e) {
      const link = e.target.closest("a[href]");
      if (!link) return;

      const href = link.getAttribute("href");

      // Vérifie si c'est un lien interne (même domaine)
      const isInternal =
        link.hostname === window.location.hostname ||
        href.startsWith("/") ||
        href.startsWith("./") ||
        href.startsWith("../");

      const isAnchor = href.startsWith("#");

      if (isInternal && !isAnchor) {
        // Utilise la View Transitions API si disponible (Chrome 111+)
        if ("startViewTransition" in document) {
          e.preventDefault();
          document.startViewTransition(() => {
            window.location.href = href;
          });
        } else {
          // Fallback élégant : transition CSS simple
          document.documentElement.classList.add("page-transition");

          // Petit délai pour permettre la transition CSS
          setTimeout(() => {
            // La navigation se fait naturellement sans preventDefault
          }, 50);
        }
      }
    });

    // Nettoyage après navigation (pour le fallback)
    window.addEventListener("pageshow", function (event) {
      document.documentElement.classList.remove("page-transition");

      if (event.persisted) {
        // Page restaurée depuis le cache - réapplication du thème si nécessaire
        const stored = localStorage.getItem("dark-mode");
        const systemDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        const isDark =
          stored === "enabled" || (stored !== "disabled" && systemDark);

        document.documentElement.classList.toggle("dark-mode", isDark);
      }
    });
  }

  // Initialisation des transitions de page
  initPageTransitions();
}
