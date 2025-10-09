/**
 * Core Web Vitals monitoring and optimization system
 * @fileoverview Real-time web performance metrics monitoring with automatic optimizations
 * @author Christophe Lecart
 */

/**
 * Initializes Core Web Vitals monitoring with automatic optimizations
 * @function initWebVitals
 * @description Configures LCP, FID, CLS, FCP, TTFB monitoring with optimization triggers
 * @returns {void}
 */
export function initWebVitals() {
  /**
   * Performance APIs support check
   * @description Validates browser compatibility with PerformanceObserver
   */
  if (!("PerformanceObserver" in window)) {
    return;
  }

  /**
   * Web Vitals metrics data storage object
   * @type {object}
   * @property {number|null} lcp - Largest Contentful Paint in milliseconds
   * @property {number|null} fid - First Input Delay in milliseconds
   * @property {number|null} cls - Cumulative Layout Shift (unitless)
   * @property {number|null} fcp - First Contentful Paint in milliseconds
   * @property {number|null} ttfb - Time to First Byte in milliseconds
   */
  const vitalsData = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
  };

  /**
   * Largest Contentful Paint (LCP) monitoring
   * @description Monitors render time of largest visible content element
   */
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    vitalsData.lcp = Math.round(lastEntry.startTime);

    /**
     * Trigger optimizations if LCP is poor (>2.5s)
     * @description Automatically applies loading optimizations
     */
    if (vitalsData.lcp > 2500) {
      optimizeLCP();
    }
  });
  lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

  /**
   * First Input Delay (FID) monitoring
   * @description Monitors delay between first user interaction and response
   */
  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      vitalsData.fid = Math.round(entry.processingStart - entry.startTime);

      /**
       * Trigger optimizations if FID is poor (>100ms)
       * @description Applies interface responsiveness optimizations
       */
      if (vitalsData.fid > 100) {
        optimizeFID();
      }
    }
  });
  fidObserver.observe({ entryTypes: ["first-input"] });

  /**
   * Cumulative Layout Shift (CLS) monitoring
   * @description Monitors unintentional layout shifts
   */
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        vitalsData.cls = Math.round(clsValue * 1000) / 1000;
      }
    }

    /**
     * Trigger optimizations if CLS is poor (>0.1)
     * @description Applies visual stability corrections
     */
    if (vitalsData.cls > 0.1) {
      optimizeCLS();
    }
  });
  clsObserver.observe({ entryTypes: ["layout-shift"] });

  /**
   * First Contentful Paint (FCP) monitoring
   * @description Monitors time to first visible content display
   */
  const navigationObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === "first-contentful-paint") {
        vitalsData.fcp = Math.round(entry.startTime);
      }
    }
  });
  navigationObserver.observe({ entryTypes: ["paint"] });

  /**
   * Time to First Byte (TTFB) calculation
   * @description Measures initial server response time
   */
  const navTiming = performance.getEntriesByType("navigation")[0];
  if (navTiming) {
    vitalsData.ttfb = Math.round(
      navTiming.responseStart - navTiming.requestStart
    );
  }

  /**
   * Resource timing monitoring activation for optimization
   * @description Monitors resource loading performance
   */
  monitorResourceTiming();

  /**
   * Final Web Vitals report generation after complete loading
   * @description 1s delay to ensure all metrics are captured
   */
  window.addEventListener("load", () => {
    setTimeout(() => {
      reportVitals(vitalsData);
    }, 1000);
  });
}

/**
 * Optimizes Largest Contentful Paint (LCP)
 * @function optimizeLCP
 * @description Applies loading optimizations to improve LCP
 * @returns {void}
 */
function optimizeLCP() {
  /**
   * LCP candidate image preloading
   * @description Converts first 2 lazy images to eager loading
   */
  const images = document.querySelectorAll(
    'img[loading="lazy"]:not([data-optimized])'
  );
  images.forEach((img, index) => {
    if (index < 2) {
      /**
       * Above-the-fold image optimization
       * @description Only first 2 images are optimized
       */
      img.loading = "eager";
      img.setAttribute("data-optimized", "true");
    }
  });

  /**
   * Non-critical CSS deferring
   * @description Loads non-essential CSS asynchronously
   */
  const stylesheets = document.querySelectorAll(
    'link[rel="stylesheet"]:not([data-critical])'
  );
  stylesheets.forEach((link) => {
    if (!link.media || link.media === "all") {
      link.media = "print";
      link.onload = function () {
        this.media = "all";
      };
    }
  });
}

/**
 * Optimizes First Input Delay (FID)
 * @function optimizeFID
 * @description Improves responsiveness by deferring heavy JavaScript tasks
 * @returns {void}
 */
function optimizeFID() {
  /**
   * Long task chunking with Scheduler API
   * @description Uses modern scheduler API or setTimeout fallback
   */
  if ("scheduler" in window) {
    window.scheduler.postTask(
      () => {
        /**
         * Heavy computation deferring in background
         * @description Background priority to avoid UI blocking
         */
        optimizeAnimations();
      },
      { priority: "background" }
    );
  } else {
    setTimeout(optimizeAnimations, 0);
  }
}

function optimizeCLS() {
  const images = document.querySelectorAll("img:not([width]):not([height])");
  images.forEach((img) => {
    img.style.aspectRatio = "auto";
    img.style.width = "auto";
    img.style.height = "auto";
  });

  const fontPreloads = [
    "/fonts/poppins-regular.woff2",
    "/fonts/poppins-bold.woff2",
  ];

  fontPreloads.forEach((font) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "font";
    link.type = "font/woff2";
    link.crossOrigin = "anonymous";
    link.href = font;
    document.head.appendChild(link);
  });
}

function optimizeAnimations() {
  // Reduce animations for users who prefer reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.style.setProperty("--duration-fast", "0ms");
    document.documentElement.style.setProperty("--duration-normal", "0ms");
    document.documentElement.style.setProperty("--duration-slow", "0ms");
  }

  // Use will-change property for animated elements
  const animatedElements = document.querySelectorAll(
    '[class*="fade"], [class*="slide"]'
  );
  animatedElements.forEach((el) => {
    el.style.willChange = "transform, opacity";

    // Remove will-change after animation
    el.addEventListener(
      "animationend",
      () => {
        el.style.willChange = "auto";
      },
      { once: true }
    );
  });
}

function monitorResourceTiming() {
  const resourceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 1000) {
        // Slow resource detected
      }

      if (entry.transferSize > 500000) {
        // Large resource detected
      }
    }
  });

  resourceObserver.observe({ entryTypes: ["resource"] });
}

function reportVitals(vitals) {
  const score = calculatePerformanceScore(vitals);

  if (window.analytics) {
    window.analytics.trackEvent(
      "Performance",
      "WebVitals",
      JSON.stringify(vitals)
    );
  }
}

function calculatePerformanceScore(vitals) {
  let score = 100;

  // LCP scoring (0-40 points)
  if (vitals.lcp > 4000) score -= 40;
  else if (vitals.lcp > 2500) score -= 20;
  else if (vitals.lcp > 1200) score -= 10;

  // FID scoring (0-30 points)
  if (vitals.fid > 300) score -= 30;
  else if (vitals.fid > 100) score -= 15;
  else if (vitals.fid > 50) score -= 5;

  // CLS scoring (0-30 points)
  if (vitals.cls > 0.25) score -= 30;
  else if (vitals.cls > 0.1) score -= 15;
  else if (vitals.cls > 0.05) score -= 5;

  return Math.max(0, score);
}

function getPerformanceRating(score) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 50) return "Needs Improvement";
  return "Poor";
}
