/**
 * Point d'entrée JavaScript - Organisation optimisée
 */
import { initDarkMode } from "./modules/darkmode.js";
import { initAnimations } from "./modules/animations.js";
import { initNavigation } from "./modules/navigation.js";
import { initContactForm } from "./modules/contact-form.js";
import { initGDPRBanner } from "./utils/gdpr.js";
import { initModals } from "./utils/modal.js";
import { initProjectNavigation } from "./modules/project-navigation.js";
import { initFormEnhancements } from "./modules/form-enhancements.js";
import { initVideoHandler } from "./modules/videoHandler.js";
import { registerServiceWorker } from "./utils/sw-register.js";

// Exécution optimisée en trois phases
document.addEventListener("DOMContentLoaded", () => {
  // Phase 1: Interface critique (immédiate)
  initDarkMode();
  initNavigation();

  // Phase 2: Fonctionnalités secondaires (différées)
  requestAnimationFrame(() => {
    setTimeout(() => {
      // Fonctionnalités communes
      initAnimations();
      initFormEnhancements();
      initGDPRBanner();
      initModals();

      // Fonctionnalités conditionnelles
      if (document.querySelector(".project-navigation")) {
        initProjectNavigation();
      }

      initContactForm();
    }, 100);
  });

  // Phase 3: Fonctionnalités non-critiques (après chargement complet)
  window.addEventListener("load", () => {
    initVideoHandler();
    registerServiceWorker();
  });
});
