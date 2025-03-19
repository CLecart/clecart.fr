/**
 * Module pour la navigation et le menu mobile
 */
export function initNavigation() {
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
      }, 300);
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
        }, 300);
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
      }, 300);
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
          const headerHeight = document.querySelector("header").offsetHeight;
          const targetPosition =
            targetElement.getBoundingClientRect().top + window.pageYOffset;

          window.scrollTo({
            top: targetPosition - headerHeight - 20,
            behavior: "smooth",
          });
        }
      });
    });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  window.addEventListener("resize", setMenuWidth);
}
