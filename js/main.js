/**
 *Main JavaScript entry point for portfolio website
 * @fileoverview Handles module initialization and global functionality
 * @author Christophe Lecart
 */

// Remove no-js class immediately when JavaScript loads
document.documentElement.classList.remove("no-js");

import { initDarkMode } from "./modules/darkmode.js";
import { initNavigation } from "./modules/navigation.js";
import { initAnimations, initTypewriterEffect } from "./modules/animations.js";
import { initContactForm } from "./modules/contact-form.js";
import { initProjectNavigation } from "./modules/project-navigation.js";
import { initVideoHandler } from "./modules/videoHandler.js";
import { initGDPRBanner } from "./utils/gdpr.js";
import { initModals } from "./utils/modal.js";
import { initPerformanceOptimizations } from "./utils/performance.js";
import { registerServiceWorker } from "./utils/sw-register.js";
import { initWebVitals } from "./utils/webvitals.js";
import PrivacyAnalytics from "./utils/analytics.js";

/**
 * Application initialization event handler
 * @description Initializes all modules in optimal order for performance
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initNavigation();
  initPerformanceOptimizations();
  initWebVitals();

  /**
   * Privacy-first analytics initialization
   * @type {PrivacyAnalytics}
   * @global
   */
  window.analytics = new PrivacyAnalytics();

  requestAnimationFrame(() => {
    initAnimations();
    initTypewriterEffect();
    initGDPRBanner();
    initModals();
    initContactForm();
    initProjectNavigation();
  });

  window.addEventListener("load", () => {
    initVideoHandler();
    registerServiceWorker();

    setTimeout(() => {
      const criticalElements = document.querySelectorAll(
        ".hero .fade-in:not(.appear), .about-intro:not(.appear)"
      );
      criticalElements.forEach((el) => el.classList.add("appear"));
    }, 1000);

    setTimeout(() => {
      reportLoadPerformance();
    }, 1000);
  });
});

/**
 * Collects and reports load performance metrics
 * @function reportLoadPerformance
 * @description Uses Navigation Timing API to measure performance
 * @returns {void}
 */
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

    if (window.analytics) {
      window.analytics.trackEvent(
        "Performance",
        "LoadMetrics",
        JSON.stringify(metrics)
      );
    }
  }
}
