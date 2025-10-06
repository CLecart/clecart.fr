/**
 * Module de gestion du mode sombre - optimisé et robuste
 */
export function initDarkMode() {
  const body = document.body;

  // Utiliser le toggle existant dans le HTML
  const darkModeToggle = document.querySelector(".dark-mode-toggle");

  if (!darkModeToggle) {
    console.error("Dark mode toggle not found in HTML");
    return;
  }

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
      localStorage.setItem("dark-mode", "enabled");
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("dark-mode", "disabled");
    }

    // Mettre à jour l'icône
    updateToggleIcon(isDark);

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

  // Synchronisation avec l'état initial défini dans le HTML
  const currentDarkMode = body.classList.contains("dark-mode");
  const darkModePreference = localStorage.getItem("dark-mode");

  // Mise à jour de l'icône en fonction de l'état actuel
  updateToggleIcon(currentDarkMode);

  // Éviter de réappliquer le thème s'il est déjà correct
  if (darkModePreference === null) {
    // Première visite - utiliser la préférence système
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (currentDarkMode !== systemPrefersDark) {
      applyTheme(systemPrefersDark);
    }
  } else {
    const shouldBeDark = darkModePreference !== "disabled";
    if (currentDarkMode !== shouldBeDark) {
      applyTheme(shouldBeDark);
    }
  }

  darkModeToggle.addEventListener("click", () => {
    const newDarkMode = !body.classList.contains("dark-mode");
    applyTheme(newDarkMode);
  });

  function updateToggleIcon(isDark) {
    const icon =
      darkModeToggle.querySelector("i") || darkModeToggle.querySelector("span");
    if (icon) {
      if (icon.tagName === "I") {
        icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
      } else {
        icon.textContent = isDark ? "☀️" : "🌙";
        icon.className = isDark ? "sun-icon" : "moon-icon";
      }
    }
    darkModeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
  }
}
