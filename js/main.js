/**
 *Main JavaScript entry point for portfolio website
 * @file Handles module initialization and global functionality
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
import { initModals } from "./utils/modal.js";
import { initPerformanceOptimizations } from "./utils/performance.js";
import { registerServiceWorker } from "./utils/sw-register.js";
import { initWebVitals } from "./utils/webvitals.js";
import PrivacyAnalytics from "./utils/analytics.js";
import { loadRuntimeConfig } from "./utils/config.js";

/**
 * Initialize video duration limiter
 * @description Limits videos with data-duration attribute to specified length
 */
function initVideoDurationLimiter() {
  const videoLimiters = document.querySelectorAll("video[data-duration]");
  videoLimiters.forEach((video) => {
    const maxDuration = Number.parseFloat(video.dataset.duration);
    video.addEventListener("timeupdate", () => {
      if (video.currentTime >= maxDuration) {
        video.currentTime = 0;
      }
    });
  });
}

/**
 * Initialize view more projects button
 * @description Shows one full grid row by default, adapts on resize
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
      card.classList.remove("visible", "project-card--hidden");
      if (i >= toShow) {
        card.classList.add("project-card--hidden");
      }
    });
    btn.style.display = toShow >= allCards.length ? "none" : "";
    btn.textContent = "View More Projects";
  }

  btn.addEventListener("click", () => {
    expanded = !expanded;
    if (expanded) {
      allCards.forEach((card) => {
        card.classList.remove("project-card--hidden");
        card.classList.remove("visible");
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

  let resizeTimer;
  globalThis.addEventListener("resize", () => {
    if (expanded) {
      return;
    }
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(showInitialCards, 150);
  });
}

/**
 * Application initialization event handler
 * @description Initializes all modules in optimal order for performance
 * @listens Document#event:DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", async () => {
  // Load runtime config before modules that depend on it (contact form).
  const cfg = await loadRuntimeConfig();
  globalThis.runtimeConfig = cfg;

  if (cfg?.emailjs?.user && typeof emailjs !== "undefined") {
    try {
      emailjs.init(cfg.emailjs.user);
    } catch (e) {
      console.warn("EmailJS initialization failed:", e);
    }
  }

  initDarkMode();
  initNavigation();
  initPerformanceOptimizations();
  initWebVitals();

  globalThis.analytics = new PrivacyAnalytics();

  requestAnimationFrame(() => {
    initAnimations();
    initTypewriterEffect();
    initGDPRBanner();
    initModals();
    initContactForm();
    initProjectNavigation();
    initViewMoreProjects();
  });

  globalThis.addEventListener("load", () => {
    initVideoHandler();
    initVideoDurationLimiter();
    registerServiceWorker();

    setTimeout(() => {
      const criticalElements = document.querySelectorAll(
        ".hero .fade-in:not(.appear), .about-intro:not(.appear)"
      );
      criticalElements.forEach((el) => el.classList.add("appear"));
    }, 1000);

    setTimeout(() => {
      reportLoadPerformance();
    }, 1000);
  });
});

/**
 * Collects and reports load performance metrics
 * @function reportLoadPerformance
 * @description Uses Navigation Timing API to measure performance
 * @returns {void}
 */
function reportLoadPerformance() {
  const navigation = performance.getEntriesByType("navigation")[0];
  if (navigation) {
    const metrics = {
      dns: Math.round(
        navigation.domainLookupEnd - navigation.domainLookupStart
      ),
      connection: Math.round(navigation.connectEnd - navigation.connectStart),
      ttfb: Math.round(navigation.responseStart - navigation.requestStart),
      download: Math.round(navigation.responseEnd - navigation.responseStart),
      domReady: Math.round(
        navigation.domContentLoadedEventEnd - navigation.navigationStart
      ),
      windowLoad: Math.round(
        navigation.loadEventEnd - navigation.navigationStart
      ),
    };

    globalThis.analytics?.trackEvent(
      "Performance",
      "LoadMetrics",
      JSON.stringify(metrics)
    );
  }
}
