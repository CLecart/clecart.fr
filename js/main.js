/**
 * main.js
 * Point d'entrée principal du JavaScript du site portfolio
 * Gère l'initialisation des modules et des fonctionnalités globales
 */

// Importation des modules nécessaires
import { initDarkMode } from "./modules/darkmode.js";
import { initNavigation } from "./modules/navigation.js";
import { initAnimations, initTypewriterEffect } from "./modules/animations.js";
import { initContactForm } from "./modules/contact-form.js";
import { initFormEnhancements } from "./modules/form-enhancements.js";
import { initProjectNavigation } from "./modules/project-navigation.js";
import { initVideoHandler } from "./modules/videoHandler.js";
import { initGDPRBanner } from "./utils/gdpr.js";
import { initModals } from "./utils/modal.js";
import { initPerformanceOptimizations } from "./utils/performance.js";
import { registerServiceWorker } from "./utils/sw-register.js";
import { initWebVitals } from "./utils/webvitals.js";
import PrivacyAnalytics from "./utils/analytics.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialisation des fonctionnalités critiques au chargement du DOM
  initDarkMode();
  initNavigation();
  initPerformanceOptimizations();
  initWebVitals(); // Core Web Vitals monitoring

  // Initialize privacy-friendly analytics
  window.analytics = new PrivacyAnalytics();

  requestAnimationFrame(() => {
    setTimeout(() => {
      // Initialisation différée des animations et modules non critiques
      initAnimations();
      initTypewriterEffect();
      initFormEnhancements();
      initGDPRBanner();
      initModals();
      initContactForm();
      initProjectNavigation();
    }, 100);
  });

  window.addEventListener("load", () => {
    // Initialisation des fonctionnalités dépendantes du chargement complet
    initVideoHandler();
    registerServiceWorker();

    // Performance monitoring after load
    setTimeout(() => {
      reportLoadPerformance();
    }, 1000);
  });
});

// Report load performance metrics
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

    console.log("Load Performance:", metrics);

    if (window.analytics) {
      window.analytics.trackEvent(
        "Performance",
        "LoadMetrics",
        JSON.stringify(metrics)
      );
    }
  }
}
