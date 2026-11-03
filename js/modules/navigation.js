/**
 * Navigation management
 * @author Christophe Lecart
 */

/**
 * Bring a section to rest just under the fixed header
 * @function scrollToSection
 * @description Lands the section so its top rule meets the header's, which sits
 * at bottom: -3px. Exported so anything that needs to return to a section — the
 * nav links, the project grid collapsing — lands identically; a second copy of
 * this arithmetic would drift from the header's CSS the first time it changes.
 * The scroll is smooth only through the scroll-behavior of html, which the
 * reduced-motion query in animations.css turns off: asking for "smooth" here
 * would override the visitor's setting.
 * @param {string} targetId - Hash selector of the target section, e.g. "#projects"
 * @returns {void}
 */
export function scrollToSection(targetId) {
  const targetElement = document.querySelector(targetId);
  const header = document.querySelector("header");

  if (!targetElement || !header) {
    return;
  }

  const targetPosition =
    targetElement.getBoundingClientRect().top + globalThis.scrollY;
  const headerTraitOffset = 3;
  const additionalOffset = targetId === "#skills" ? 50 : 0;
  const scrollTarget =
    targetPosition - header.offsetHeight + headerTraitOffset + additionalOffset;

  globalThis.scrollTo({ top: Math.max(0, scrollTarget) });
}

/**
 * Wire the burger menu, its dismissal paths, and anchor scrolling
 * @function initNavigation
 * @description Only the active class and aria-expanded change here. header.css owns every state of the menu, its slide included, and holds visibility back with a transition delay until the slide-out has played, so a closed menu leaves the accessibility tree without a timer copying the CSS duration. Project tabs are left to project-navigation.js: they switch the project shown in place, and scrolling to their target would move the page under the visitor. The skip link keeps the native jump: only a real fragment navigation moves keyboard focus into <main>, and this scroll would leave it on the link.
 * @returns {void}
 */
export function initNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("nav ul");
  const menuIcon = navToggle?.querySelector("use");
  const sprite = menuIcon?.getAttribute("href")?.split("#")[0];

  if (!navToggle || !navMenu) {
    return;
  }

  /**
   * Open or close the menu, and show it on the toggle: a cross and aria-expanded="true", or a burger and "false"
   * @function setMenuOpen
   * @description Only the fragment of the <use> reference changes: the sprite path stays the one the page's markup wrote, so no URL here can drift from the HTML. The <svg> keeps the burger's viewBox; the default preserveAspectRatio centres the narrower cross inside it, so both glyphs share the button's centre. The icon is aria-hidden, so aria-expanded is the only state a screen reader gets.
   * @param {boolean} open - Whether the menu is now open
   * @returns {void}
   */
  function setMenuOpen(open) {
    navMenu.classList.toggle("active", open);
    menuIcon?.setAttribute("href", `${sprite}#${open ? "xmark" : "bars"}`);
    navToggle.setAttribute("aria-expanded", String(open));
  }

  navToggle.addEventListener("click", () => {
    setMenuOpen(!navMenu.classList.contains("active"));
  });

  document.querySelectorAll("nav ul li a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("click", (e) => {
    if (
      navMenu.classList.contains("active") &&
      !e.target.closest("nav") &&
      !e.target.closest(".nav-toggle")
    ) {
      setMenuOpen(false);
    }
  });

  document
    .querySelectorAll(
      'a[href^="#"]:not([href="#"]):not(.nav-btn):not(.skip-link)'
    )
    .forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        scrollToSection(this.getAttribute("href"));
      });
    });
}
