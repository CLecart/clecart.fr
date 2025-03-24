/**
 * Point d'entrée JavaScript - Initialisation des modules
 * Optimisé et harmonisé
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

document.addEventListener("DOMContentLoaded", () => {
  // Interface critique (prioritaire)
  initDarkMode();
  initNavigation();

  // Optimisation chargement
  setTimeout(() => {
    // Fonctionnalités secondaires
    initAnimations();
    initFormEnhancements();
    initGDPRBanner();
    initModals();

    // Fonctionnalités conditionnelles
    if (document.querySelector(".project-navigation")) {
      initProjectNavigation();
    }

    // Formulaire de contact
    initContactForm();

    // Gestion optimisée des vidéos
    initVideoHandler();
  }, 100);
});
