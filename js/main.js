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
  initDarkMode();
  initAnimations();
  initTypewriter();
  initNavigation();
  initContactForm();
  initGDPRBanner();
  initModals();
  initProjectNavigation();
});
