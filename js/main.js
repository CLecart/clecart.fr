/**
 * Point d'entrée principal du JavaScript
 * Initialise tous les modules nécessaires au fonctionnement du site
 */
import { initDarkMode } from "./modules/darkmode.js";
import { initAnimations, initTypewriter } from "./modules/animations.js";
import { initNavigation } from "./modules/navigation.js";
import { initContactForm } from "./modules/contact-form.js";
import { initGDPRBanner } from "./utils/gdpr.js";
import { initModals } from "./utils/modal.js";
import { initProjectNavigation } from "./modules/project-navigation.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialisation du mode sombre en premier pour éviter le flash
  initDarkMode();

  // Initialisation des modules d'interface
  initAnimations();
  initTypewriter();
  initNavigation();

  // Initialisation des fonctionnalités interactives
  initContactForm();
  initGDPRBanner();
  initModals();

  // Navigation spécifique aux projets (si applicable)
  if (document.querySelector(".project-navigation")) {
    initProjectNavigation();
  }
});
