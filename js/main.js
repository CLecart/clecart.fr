/**
 * Point d'entrée principal JavaScript
 */
import { initDarkMode } from "./modules/darkmode.js";
import { initAnimations, initTypewriter } from "./modules/animations.js";
import { initNavigation } from "./modules/navigation.js";
import { initContactForm } from "./modules/contact-form.js";
import { initGDPRBanner } from "./utils/gdpr.js";
import { initModals } from "./utils/modal.js";

// Initialiser tous les modules quand le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  // Initialiser tous les modules
  initDarkMode();
  initAnimations();
  initTypewriter();
  initNavigation();
  initContactForm();
  initGDPRBanner();
  initModals();
});
