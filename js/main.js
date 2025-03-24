/**
 * Point d'entrée JavaScript - Initialisation des modules
 */
import { initDarkMode } from "./modules/darkmode.js";
import { initAnimations } from "./modules/animations.js";
import { initNavigation } from "./modules/navigation.js";
import { initContactForm } from "./modules/contact-form.js";
import { initGDPRBanner } from "./utils/gdpr.js";
import { initModals } from "./utils/modal.js";
import { initProjectNavigation } from "./modules/project-navigation.js";
import { initFormEnhancements } from "./modules/form-enhancements.js";

document.addEventListener("DOMContentLoaded", () => {
  // Mode sombre (prioritaire)
  initDarkMode();

  // Interface
  initAnimations();
  initNavigation();
  initFormEnhancements();

  // Fonctionnalités
  initContactForm();
  initGDPRBanner();
  initModals();

  // Navigation projets (conditionnelle)
  if (document.querySelector(".project-navigation")) {
    initProjectNavigation();
  }
});
