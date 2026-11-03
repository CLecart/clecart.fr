/**
 * Entry point of the site's pages, and the one module that calls every init*()
 * @description It runs on import, as js/cv.js does for /cv/; every other module only exports.
 * @author Christophe Lecart
 */

document.documentElement.classList.remove("no-js");

import { initDarkMode } from "./modules/darkmode.js";
import { initNavigation, scrollToSection } from "./modules/navigation.js";
import { initAnimations, initTypewriterEffect } from "./modules/animations.js";
import { initContactForm } from "./modules/contact-form.js";
import { initProjectNavigation } from "./modules/project-navigation.js";
import { initVideoHandler } from "./modules/videoHandler.js";
import { initGDPRBanner } from "./utils/gdpr.js";
import { registerServiceWorker } from "./utils/sw-register.js";

/**
 * Collapse the project grid to whole rows behind a View More toggle
 * @description While collapsed, the visible count is recomputed on resize; an expanded grid is left alone.
 */
function initViewMoreProjects() {
  const btn = document.getElementById("view-more-btn");
  const grid = document.querySelector(".projects-grid");
  const allCards = [
    ...document.querySelectorAll(".projects-grid .project-card"),
  ];

  if (!btn || !grid || allCards.length === 0) {
    return;
  }

  let expanded = false;
  let resizeTimer;

  /**
   * Count the columns the grid currently resolves to
   * @function getColumnCount
   * @description Reads the computed grid-template-columns instead of re-testing breakpoints in JS, so the CSS media queries stay the single source of truth for the layout.
   * @returns {number} Number of columns in the current layout
   */
  function getColumnCount() {
    return getComputedStyle(grid).gridTemplateColumns.split(" ").length;
  }

  /**
   * Collapse the project grid back to its initial rows
   * @function showInitialCards
   * @description Rounds the visible count up to a whole number of columns so the grid never ends on a half-filled row, and drops the toggle entirely when every card already fits.
   * @returns {void}
   */
  function showInitialCards() {
    const colCount = getColumnCount();
    const toShow = Math.min(
      Math.ceil(3 / colCount) * colCount,
      allCards.length
    );
    allCards.forEach((card, i) => {
      card.classList.remove("project-card-hidden");
      if (i >= toShow) {
        card.classList.add("project-card-hidden");
      }
    });
    btn.style.display = toShow >= allCards.length ? "none" : "";
    btn.textContent = "View More Projects";
  }

  /* A collapse still pending from a resize would land after this click and
     undo it, leaving the button out of step with the grid. */
  btn.addEventListener("click", () => {
    clearTimeout(resizeTimer);
    expanded = !expanded;
    if (expanded) {
      allCards.forEach((card) => {
        card.classList.remove("project-card-hidden");
      });
      btn.textContent = "View Less Projects";
    } else {
      showInitialCards();
      /* The rows that vanish are above the button, so without this the visitor
         is left stranded past the end of the section they were reading. */
      scrollToSection("#projects");
    }
  });

  showInitialCards();

  globalThis.addEventListener("resize", () => {
    if (expanded) {
      return;
    }
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(showInitialCards, 150);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initNavigation();

  requestAnimationFrame(() => {
    initAnimations();
    initTypewriterEffect();
    initGDPRBanner();
    initContactForm();
    initProjectNavigation();
    initViewMoreProjects();
  });

  globalThis.addEventListener("load", () => {
    initVideoHandler();
    registerServiceWorker();
  });
});
