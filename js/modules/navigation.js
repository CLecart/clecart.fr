/**
 * Navigation management
 * @author Christophe Lecart
 */

export function initNavigation() {
  const MENU_TRANSITION_DURATION = 300;
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("nav ul");
  const menuIcon = navToggle?.querySelector("i");

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
          const header = document.querySelector("header");
          const headerHeight = header.offsetHeight;
          const targetPosition =
            targetElement.getBoundingClientRect().top + window.pageYOffset;

          // Alignement parfait : le trait de section doit se confondre avec celui du header
          // Header trait à bottom: -3px, donc on ajuste pour que les traits soient alignés
          const headerTraitOffset = 3; // Le trait du header descend de 3px sous le header

          // Ajustement spécial pour la section skills pour centrer les cards
          let additionalOffset = 0;
          if (targetId === "#skills") {
            additionalOffset = 50; // Remonte la section de 50px pour centrer les cards
          }

          const scrollTarget =
            targetPosition -
            headerHeight +
            headerTraitOffset +
            additionalOffset;

          window.scrollTo({
            top: Math.max(0, scrollTarget),
            behavior: "smooth",
          });
        }
      });
    });
}
