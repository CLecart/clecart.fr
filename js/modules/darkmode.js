/**
 * Module de gestion du mode sombre - optimisé
 */
export function initDarkMode() {
  const body = document.body;
  const darkModeToggle = document.createElement("button");
  darkModeToggle.classList.add("dark-mode-toggle");
  darkModeToggle.setAttribute("aria-label", "Toggle dark mode");
  darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';

  let headerButtons = document.querySelector(".header-buttons");

  if (!headerButtons) {
    headerButtons = document.createElement("div");
    headerButtons.classList.add("header-buttons");

    const rightContent = document.querySelector(".right-content");
    if (rightContent) {
      rightContent.appendChild(headerButtons);
    }
  }

  headerButtons.prepend(darkModeToggle);

  function applyTheme(isDark) {
    document.documentElement.classList.add("theme-transitioning");

    document
      .querySelectorAll(
        ".hero-content *, .fade-in, .slide-left, .slide-right, .btn, .btn-secondary, .form-group input, .form-group textarea, .contact-info, .contact-form"
      )
      .forEach((el) => {
        el.classList.add("no-transition");
        el.style.backgroundColor = "transparent";
      });

    if (isDark) {
      body.classList.add("dark-mode");
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem("dark-mode", "enabled");
    } else {
      body.classList.remove("dark-mode");
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem("dark-mode", "disabled");
    }

    const contactInfo = document.querySelector(".contact-info");
    const contactForm = document.querySelector(".contact-form");

    if (contactInfo) {
      contactInfo.style.backgroundColor = isDark
        ? "var(--card-dark)"
        : "var(--white)";
    }
    if (contactForm) {
      contactForm.style.backgroundColor = isDark
        ? "var(--card-dark)"
        : "var(--white)";
    }

    setTimeout(() => {
      document.querySelectorAll(".no-transition").forEach((el) => {
        el.classList.remove("no-transition");
        el.style.backgroundColor = "";
      });
      document.documentElement.classList.remove("theme-transitioning");
    }, 150);
  }

  const darkModePreference = localStorage.getItem("dark-mode");
  applyTheme(darkModePreference !== "disabled");

  darkModeToggle.addEventListener("click", () => {
    applyTheme(!body.classList.contains("dark-mode"));
  });
}
