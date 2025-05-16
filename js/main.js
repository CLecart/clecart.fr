/**
 * Point d'entrée JavaScript - Organisation optimisée
 */
import { initDarkMode } from "./modules/darkmode.js";
import { initAnimations, initTypewriterEffect } from "./modules/animations.js";
import { initNavigation } from "./modules/navigation.js";
import { initContactForm } from "./modules/contact-form.js";
import { initGDPRBanner } from "./utils/gdpr.js";
import { initModals } from "./utils/modal.js";
import { initProjectNavigation } from "./modules/project-navigation.js";
import { initFormEnhancements } from "./modules/form-enhancements.js";
import { initVideoHandler } from "./modules/videoHandler.js";
import { registerServiceWorker } from "./utils/sw-register.js";
import { initPerformanceOptimizations } from "./utils/performance.js";

document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initNavigation();
  initPerformanceOptimizations();

  requestAnimationFrame(() => {
    setTimeout(() => {
      initAnimations();
      initTypewriterEffect();
      initFormEnhancements();
      initGDPRBanner();
      initModals();

      if (document.querySelector(".project-navigation")) {
        initProjectNavigation();
      }

      initContactForm();
    }, 100);
  });

  window.addEventListener("load", () => {
    initVideoHandler();
    registerServiceWorker();
  });
});
