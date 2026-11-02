/**
 * Dark mode management
 * @author Christophe Lecart
 */

/**
 * Wire the theme toggle to the theme the head bootstrap already applied
 * @function initDarkMode
 * @description The bootstrap in each page's <head> puts the class and color-scheme on <html> before the first paint, from the stored choice or, failing one, the system preference; this module only reads that state and flips it. The theme lives on <html> because <body> does not exist yet when the bootstrap runs. Nothing is stored until the visitor clicks, so a visitor who never chooses keeps following the system preference.
 * @returns {void}
 */
export function initDarkMode() {
  const darkModeToggle = document.querySelector(".dark-mode-toggle");
  const icon = darkModeToggle?.querySelector(".moon-icon");
  if (!darkModeToggle || !icon) {
    return;
  }

  const root = document.documentElement;

  /**
   * Show the theme the toggle would switch to
   * @function updateToggleIcon
   * @description The icon advertises the destination, not the current state: dark mode shows a sun.
   * @param {boolean} isDark - Current theme
   * @returns {void}
   */
  function updateToggleIcon(isDark) {
    icon.textContent = isDark ? "☀️" : "🌙";
  }

  updateToggleIcon(root.classList.contains("dark-mode"));

  darkModeToggle.addEventListener("click", () => {
    const isDark = root.classList.toggle("dark-mode");
    root.style.colorScheme = isDark ? "dark" : "light";
    localStorage.setItem("dark-mode", isDark ? "enabled" : "disabled");
    updateToggleIcon(isDark);
  });
}
