/**
 * Dark mode management
 * @author Christophe Lecart
 */

/**
 * Wire the theme toggle and reconcile the theme already on screen
 * @function initDarkMode
 * @description The anti-FOUC bootstrap in <head> has already applied a theme, so this only writes when the stored or system preference disagrees with what is displayed. The system preference is consulted only while no explicit choice exists; once the visitor has chosen, that choice wins forever.
 * @returns {void}
 */
export function initDarkMode() {
  const darkModeToggle = document.querySelector(".dark-mode-toggle");
  if (!darkModeToggle) {
    return;
  }

  /**
   * Switch the theme, persist the choice, and refresh the toggle icon
   * @function applyTheme
   * @description Persisting is deliberately coupled to applying: every call records an explicit choice in localStorage. That is why the system-preference path calls this only when the theme actually differs — calling it unconditionally would freeze the current OS preference into storage on first visit and stop following it thereafter.
   * @param {boolean} isDark - Target theme; true switches to dark, false to light
   * @returns {void}
   */
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

  /**
   * Point the toggle at the theme it would switch to
   * @function updateToggleIcon
   * @description The icon advertises the destination, not the current state: dark mode shows a sun. Both markup variants in use are supported — a Font Awesome <i> whose class is swapped, or a <span> carrying an emoji — because the pages do not agree on which one they ship.
   * @param {boolean} isDark - Current dark mode state
   * @returns {void}
   */
  function updateToggleIcon(isDark) {
    const icon =
      darkModeToggle.querySelector("i") || darkModeToggle.querySelector("span");
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
    const systemPrefersDark = globalThis.matchMedia(
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
    const newDarkMode = !document.body.classList.contains("dark-mode");
    applyTheme(newDarkMode);
  });
}
