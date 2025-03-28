/**
 * Module pour la navigation et le menu mobile
 */
export function initNavigation() {
  // Constante pour la durée de transition du menu - facilite la maintenance
  const MENU_TRANSITION_DURATION = 300;

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
          // 1. Empêcher de nouvelles interactions pendant le défilement
          document.documentElement.classList.add("scrolling-in-progress");

          // 2. Marquer le lien actif immédiatement pour un retour visuel
          document.querySelectorAll("nav a").forEach((link) => {
            link.classList.remove("active");
            link.setAttribute("tabindex", "-1"); // Désactiver la focalisation pendant l'animation
          });
          this.classList.add("active");

          // 3. Calculer la position avec précision
          const headerHeight = document.querySelector("header").offsetHeight;
          const targetPosition =
            targetElement.getBoundingClientRect().top + window.pageYOffset;
          const buffer = window.innerWidth <= 768 ? 15 : 25;

          // 4. Utiliser requestAnimationFrame pour une animation plus fluide
          smoothScrollTo(
            window.pageYOffset,
            targetPosition - headerHeight - buffer,
            600 // Durée en ms
          );

          // 5. Restaurer les interactions après une durée suffisante
          setTimeout(() => {
            document.documentElement.classList.remove("scrolling-in-progress");
            document.querySelectorAll("nav a").forEach((link) => {
              link.removeAttribute("tabindex");
            });
          }, 650); // Légèrement plus que la durée d'animation
        }
      });
    });

  // Fonction de défilement doux optimisée avec requestAnimationFrame
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

  // Remplacer seulement la fonction de défilement
  window.addEventListener("scroll", () => {
    // Ajouter un seuil minimum pour éviter le tremblement
    if (window.scrollY > 5) {
      header.classList.add("scrolled");
    } else if (window.scrollY === 0) {
      // S'assurer qu'on est vraiment au sommet
      header.classList.remove("scrolled");
    }
  });

  window.addEventListener("resize", setMenuWidth);
}
