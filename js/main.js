/**
 * Point d'entrée principal JavaScript
 * Initialise tous les modules du site
 */
import { initDarkMode } from "./modules/darkmode.js";
import { initAnimations, initTypewriter } from "./modules/animations.js";
import { initNavigation } from "./modules/navigation.js";
import { initContactForm } from "./modules/contact-form.js";
import { initGDPRBanner } from "./utils/gdpr.js";
import { initModals } from "./utils/modal.js";
import { initProjectNavigation } from "./modules/project-navigation.js"; // Ajout de l'import

document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initAnimations();
  initTypewriter();
  initNavigation();
  initContactForm();
  initGDPRBanner();
  initModals();
  initProjectNavigation(); // Ajout de l'initialisation
});
