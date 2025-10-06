/**
 * @fileoverview Critical path JavaScript inlined in HTML head
 * @description Loads immediately to prevent FOUC and setup essential functionality
 * @version 1.0.0
 * @author Christophe Lecart <djlike@hotmail.fr>
 */

(function () {
  "use strict";

  /**
   * Remove loading class - theme is already handled in HTML head
   * @description Safe to remove loading class as theme is set before CSS loads
   */
  document.documentElement.classList.remove("js-loading");

  /**
   * Preload critical resources for performance optimization
   * @type {string[]} Array of resource URLs to preload
   */
  const preloadResources = [
    "/assets/icons/android-chrome-192x192.png",
    "/css/components/dark-mode-toggle.css",
    "/js/modules/darkmode.js",
  ];

  /**
   * Creates and appends preload links for critical resources
   * @param {string} resource - The resource URL to preload
   * @returns {void}
   */
  preloadResources.forEach((resource) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = resource.endsWith(".css")
      ? "style"
      : resource.endsWith(".js")
        ? "script"
        : "image";
    link.href = resource;
    document.head.appendChild(link);
  });

  /**
   * Performance observer for Core Web Vitals monitoring
   * @description Tracks LCP, FID, and CLS metrics for performance optimization
   * @see {@link https://web.dev/vitals/} Core Web Vitals documentation
   */
  if ("PerformanceObserver" in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "largest-contentful-paint") {
          console.log("LCP:", entry.startTime);
        }
        if (entry.entryType === "first-input-delay") {
          console.log("FID:", entry.processingStart - entry.startTime);
        }
        if (entry.entryType === "layout-shift") {
          if (!entry.hadRecentInput) {
            console.log("CLS:", entry.value);
          }
        }
      }
    });

    observer.observe({
      entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"],
    });
  }
})();
