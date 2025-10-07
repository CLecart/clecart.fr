/**
 * Dark mode management
 * @author Christophe Lecart
 */

export function initDarkMode() {
  const darkModeToggle = document.querySelector(".dark-mode-toggle");
  if (!darkModeToggle) return;

  function applyTheme(isDark) {
    const body = document.body;
    
    if (isDark) {
      body.classList.add("dark-mode");
      localStorage.setItem("dark-mode", "enabled");
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("dark-mode", "disabled");
    }
    
    updateToggleIcon(isDark);
  }

  function updateToggleIcon(isDark) {
    const icon = darkModeToggle.querySelector("i") || darkModeToggle.querySelector("span");
    if (icon) {
      if (icon.tagName === "I") {
        icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
      } else {
        icon.textContent = isDark ? "☀️" : "🌙";
      }
    }
  }

  const currentDarkMode = document.body.classList.contains("dark-mode");
  const darkModePreference = localStorage.getItem("dark-mode");
  
  updateToggleIcon(currentDarkMode);

  if (darkModePreference === null) {
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
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
    const newDarkMode = !document.body.classList.contains("dark-mode");
    applyTheme(newDarkMode);
  });
}
