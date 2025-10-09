/**
 * @fileoverview Critical path JavaScript inlined in HTML head
 * @description Loads immediately to prevent FOUC and setup essential functionality
 * @version 1.0.0
 * @author Christophe Lecart <djlike@hotmail.fr>
 */

(function () {
  "use strict";

  /**
   * Prevents Flash of Unstyled Content by removing loading class
   * @description Removes js-loading class as soon as possible to show content
   */
  document.documentElement.classList.remove("js-loading");

  /**
   * Critical theme detection and application
   * @description Must be synchronous to prevent theme flashing
   * @returns {void}
   */
  const isDarkMode = localStorage.getItem("dark-mode") !== "disabled";
  if (isDarkMode) {
    // Wait for DOM to be ready before accessing body
    if (document.body) {
      document.body.classList.add("dark-mode");
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark-mode");
      });
    }
  }

  /**
   * Note: Removed unnecessary preloads to avoid console warnings
   * Resources are loaded when needed by the main application
   */

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
