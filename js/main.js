/**
 * main.js
 * Point d'entrée principal du JavaScript du site portfolio
 * Gère l'initialisation des modules et des fonctionnalités globales
 */

// Importation des modules nécessaires
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
  // Initialisation des fonctionnalités de base au chargement du DOM
  initDarkMode();
  initNavigation();
  initPerformanceOptimizations();

  requestAnimationFrame(() => {
    setTimeout(() => {
      // Initialisation différée des animations et modules non critiques
      initAnimations();
      initTypewriterEffect();
      initFormEnhancements();
      initGDPRBanner();
      initModals();

      if (document.querySelector(".project-navigation")) {
        // Initialisation de la navigation entre projets si présente
        initProjectNavigation();
      }

      initContactForm();
    }, 100);
  });

  window.addEventListener("load", () => {
    // Initialisation des fonctionnalités dépendantes du chargement complet
    initVideoHandler();
    registerServiceWorker();
  });
});
