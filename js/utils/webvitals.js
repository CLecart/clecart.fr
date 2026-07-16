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
  if (!("PerformanceObserver" in globalThis)) {
    return;
  }

  const vitalsData = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
  };

  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    vitalsData.lcp = Math.round(lastEntry.startTime);

    if (vitalsData.lcp > 2500) {
      optimizeLCP();
    }
  });
  lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      vitalsData.fid = Math.round(entry.processingStart - entry.startTime);

      if (vitalsData.fid > 100) {
        optimizeFID();
      }
    }
  });
  fidObserver.observe({ entryTypes: ["first-input"] });

  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        vitalsData.cls = Math.round(clsValue * 1000) / 1000;
      }
    }

    if (vitalsData.cls > 0.1) {
      optimizeCLS();
    }
  });
  clsObserver.observe({ entryTypes: ["layout-shift"] });

  const navigationObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === "first-contentful-paint") {
        vitalsData.fcp = Math.round(entry.startTime);
      }
    }
  });
  navigationObserver.observe({ entryTypes: ["paint"] });

  const navTiming = performance.getEntriesByType("navigation")[0];
  if (navTiming) {
    vitalsData.ttfb = Math.round(
      navTiming.responseStart - navTiming.requestStart
    );
  }

  monitorResourceTiming();

  /**
   * Final Web Vitals report generation after complete loading
   * @description 1s delay to ensure all metrics are captured
   */
  globalThis.addEventListener("load", () => {
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
  const images = document.querySelectorAll(
    'img[loading="lazy"]:not([data-optimized])'
  );
  images.forEach((img, index) => {
    if (index < 2) {
      img.loading = "eager";
      img.setAttribute("data-optimized", "true");
    }
  });

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
  if ("scheduler" in globalThis) {
    globalThis.scheduler.postTask(
      () => {
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
}

function optimizeAnimations() {
  const animatedElements = document.querySelectorAll(
    '[class*="fade"], [class*="slide"]'
  );
  animatedElements.forEach((el) => {
    el.style.willChange = "transform, opacity";

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

  if (globalThis.analytics) {
    globalThis.analytics.trackEvent(
      "Performance",
      "WebVitals",
      JSON.stringify(vitals)
    );
  }
}

function calculatePerformanceScore(vitals) {
  let score = 100;

  if (vitals.lcp > 4000) score -= 40;
  else if (vitals.lcp > 2500) score -= 20;
  else if (vitals.lcp > 1200) score -= 10;

  if (vitals.fid > 300) score -= 30;
  else if (vitals.fid > 100) score -= 15;
  else if (vitals.fid > 50) score -= 5;

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
