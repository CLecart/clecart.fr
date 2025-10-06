// webvitals.js - Core Web Vitals monitoring and optimization
export function initWebVitals() {
  // Only run if browser supports the APIs
  if (!("PerformanceObserver" in window)) {
    console.warn("PerformanceObserver not supported");
    return;
  }

  const vitalsData = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
  };

  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    vitalsData.lcp = Math.round(lastEntry.startTime);

    // Trigger optimization if LCP is poor (>2.5s)
    if (vitalsData.lcp > 2500) {
      optimizeLCP();
    }

    console.log("LCP:", vitalsData.lcp + "ms");
  });
  lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      vitalsData.fid = Math.round(entry.processingStart - entry.startTime);

      // Trigger optimization if FID is poor (>100ms)
      if (vitalsData.fid > 100) {
        optimizeFID();
      }

      console.log("FID:", vitalsData.fid + "ms");
    }
  });
  fidObserver.observe({ entryTypes: ["first-input"] });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        vitalsData.cls = Math.round(clsValue * 1000) / 1000;
      }
    }

    // Trigger optimization if CLS is poor (>0.1)
    if (vitalsData.cls > 0.1) {
      optimizeCLS();
    }

    console.log("CLS:", vitalsData.cls);
  });
  clsObserver.observe({ entryTypes: ["layout-shift"] });

  // First Contentful Paint (FCP)
  const navigationObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === "first-contentful-paint") {
        vitalsData.fcp = Math.round(entry.startTime);
        console.log("FCP:", vitalsData.fcp + "ms");
      }
    }
  });
  navigationObserver.observe({ entryTypes: ["paint"] });

  // Time to First Byte (TTFB)
  const navTiming = performance.getEntriesByType("navigation")[0];
  if (navTiming) {
    vitalsData.ttfb = Math.round(
      navTiming.responseStart - navTiming.requestStart
    );
    console.log("TTFB:", vitalsData.ttfb + "ms");
  }

  // Resource timing for optimization
  monitorResourceTiming();

  // Report vitals after page load
  window.addEventListener("load", () => {
    setTimeout(() => {
      reportVitals(vitalsData);
    }, 1000);
  });
}

function optimizeLCP() {
  console.warn("LCP is poor, applying optimizations...");

  // Preload LCP candidate images
  const images = document.querySelectorAll(
    'img[loading="lazy"]:not([data-optimized])'
  );
  images.forEach((img, index) => {
    if (index < 2) {
      // Only first 2 images above fold
      img.loading = "eager";
      img.setAttribute("data-optimized", "true");
    }
  });

  // Defer non-critical CSS
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

function optimizeFID() {
  console.warn("FID is poor, deferring JavaScript...");

  // Break up long tasks
  if ("scheduler" in window) {
    window.scheduler.postTask(
      () => {
        // Defer heavy computations
        optimizeAnimations();
      },
      { priority: "background" }
    );
  } else {
    setTimeout(optimizeAnimations, 0);
  }
}

function optimizeCLS() {
  console.warn("CLS is poor, stabilizing layout...");

  // Add dimensions to images without them
  const images = document.querySelectorAll("img:not([width]):not([height])");
  images.forEach((img) => {
    img.style.aspectRatio = "auto";
    img.style.width = "auto";
    img.style.height = "auto";
  });

  // Preload fonts to prevent FOIT
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
      // Alert for slow resources (>1s)
      if (entry.duration > 1000) {
        console.warn(
          `Slow resource: ${entry.name} took ${Math.round(entry.duration)}ms`
        );
      }

      // Alert for large resources (>500KB)
      if (entry.transferSize > 500000) {
        console.warn(
          `Large resource: ${entry.name} is ${Math.round(entry.transferSize / 1024)}KB`
        );
      }
    }
  });

  resourceObserver.observe({ entryTypes: ["resource"] });
}

function reportVitals(vitals) {
  // Calculate performance score
  const score = calculatePerformanceScore(vitals);

  console.log("Web Vitals Report:", {
    ...vitals,
    score: score,
    rating: getPerformanceRating(score),
  });

  // Send to analytics (if consent given)
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
