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
import { loadRuntimeConfig } from "./utils/config.js";

/**
 * Initialize video duration limiter
 * @description Limits videos with data-duration attribute to specified length
 */
function initVideoDurationLimiter() {
  const videoLimiters = document.querySelectorAll("video[data-duration]");
  videoLimiters.forEach((video) => {
    const maxDuration = parseFloat(video.getAttribute("data-duration"));
    video.addEventListener("timeupdate", () => {
      if (video.currentTime >= maxDuration) {
        video.currentTime = 0;
      }
    });
  });
}

/**
 * Application initialization event handler
 * @description Initializes all modules in optimal order for performance
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", async () => {
  // Load runtime config before modules that depend on it (contact form).
  const cfg = await loadRuntimeConfig();
  globalThis.runtimeConfig = cfg;

  if (cfg?.emailjs?.user && typeof emailjs !== "undefined") {
    try {
      emailjs.init(cfg.emailjs.user);
    } catch (e) {
      console.warn("EmailJS initialization failed:", e);
    }
  }

  initDarkMode();
  initNavigation();
  initPerformanceOptimizations();
  initWebVitals();

  /**
   * Privacy-first analytics initialization
   * @type {PrivacyAnalytics}
   * @global
   */
  globalThis.analytics = new PrivacyAnalytics();

  requestAnimationFrame(() => {
    initAnimations();
    initTypewriterEffect();
    initGDPRBanner();
    initModals();
    initContactForm();
    initProjectNavigation();
  });

  globalThis.addEventListener("load", () => {
    initVideoHandler();
    initVideoDurationLimiter();
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

    globalThis.analytics?.trackEvent(
      "Performance",
      "LoadMetrics",
      JSON.stringify(metrics)
    );
  }
}
