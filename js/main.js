/**
 * @fileoverview Point d'entrée principal du JavaScript du site portfolio
 * @description Gère l'initialisation des modules et des fonctionnalités globales
 * @version 1.0.0
 * @author Christophe Lecart <djlike@hotmail.fr>
 */

/**
 * @namespace MainApp
 * @description Namespace principal de l'application portfolio
 */

/**
 * Import des modules requis pour l'initialisation de l'application
 * @requires ./modules/darkmode.js
 * @requires ./modules/navigation.js
 * @requires ./modules/animations.js
 * @requires ./modules/contact-form.js
 * @requires ./modules/form-enhancements.js
 * @requires ./modules/project-navigation.js
 * @requires ./modules/videoHandler.js
 * @requires ./utils/gdpr.js
 * @requires ./utils/modal.js
 * @requires ./utils/performance.js
 * @requires ./utils/sw-register.js
 * @requires ./utils/webvitals.js
 * @requires ./utils/analytics.js
 */
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
import { initSmartAntiFlash } from "./utils/smart-anti-flash.js";
import PrivacyAnalytics from "./utils/analytics.js";

/**
 * Gestionnaire d'événement pour l'initialisation de l'application
 * @description Initialise tous les modules dans l'ordre optimal pour les performances
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", () => {
  /**
   * Phase 1: Initialisation des fonctionnalités critiques
   * @description Modules essentiels chargés immédiatement au DOM ready
   */
  initSmartAntiFlash();
  initDarkMode();
  initNavigation();
  initPerformanceOptimizations();
  initWebVitals();

  /**
   * Initialisation des analytics respectueux de la vie privée
   * @type {PrivacyAnalytics}
   * @global
   */
  window.analytics = new PrivacyAnalytics();

  /**
   * Phase 2: Initialisation différée pour optimiser le temps de chargement
   * @description Utilise requestAnimationFrame + timeout pour éviter le blocking
   */
  requestAnimationFrame(() => {
    setTimeout(() => {
      initAnimations();
      initTypewriterEffect();
      initFormEnhancements();
      initGDPRBanner();
      initModals();
      initContactForm();
      initProjectNavigation();
    }, 100);
  });

  /**
   * Phase 3: Initialisation post-chargement complet
   * @description Fonctionnalités dépendantes du chargement de toutes les ressources
   * @listens load
   */
  window.addEventListener("load", () => {
    initVideoHandler();
    registerServiceWorker();

    /**
     * Monitoring des performances après chargement complet
     * @description Délai de 1s pour permettre la stabilisation des métriques
     */
    setTimeout(() => {
      reportLoadPerformance();
    }, 1000);
  });
});

/**
 * Collecte et rapport des métriques de performance de chargement
 * @function reportLoadPerformance
 * @description Utilise l'API Navigation Timing pour mesurer les performances
 * @returns {void}
 * @see {@link https://developer.mozilla.org/docs/Web/API/Navigation_timing_API} Navigation Timing API
 */
function reportLoadPerformance() {
  const navigation = performance.getEntriesByType("navigation")[0];
  if (navigation) {
    /**
     * Métriques de performance calculées
     * @type {Object}
     * @property {number} dns - Temps de résolution DNS en millisecondes
     * @property {number} connection - Temps d'établissement de connexion en ms
     * @property {number} ttfb - Time To First Byte en millisecondes
     * @property {number} download - Temps de téléchargement en millisecondes
     * @property {number} domReady - Temps jusqu'au DOM ready en millisecondes
     * @property {number} windowLoad - Temps total de chargement en millisecondes
     */
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

    /**
     * Envoi des métriques vers le système d'analytics si disponible
     * @description Utilise l'analytics privacy-friendly pour le tracking
     */
    if (window.analytics) {
      window.analytics.trackEvent(
        "Performance",
        "LoadMetrics",
        JSON.stringify(metrics)
      );
    }
  }
}
