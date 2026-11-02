/**
 * Core Web Vitals observation
 * @author Christophe Lecart
 */

/**
 * Observe LCP, FID, CLS and FCP, read TTFB, and hand them to analytics after load
 * @function initWebVitals
 * @description Every observer is buffered: they start at DOMContentLoaded, and a paint that lands before that would otherwise never reach them, leaving LCP and FCP null. The report waits a second past load because LCP and CLS keep updating after it.
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
  });
  lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      vitalsData.fid = Math.round(entry.processingStart - entry.startTime);
    }
  });
  fidObserver.observe({ type: "first-input", buffered: true });

  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        vitalsData.cls = Math.round(clsValue * 1000) / 1000;
      }
    }
  });
  clsObserver.observe({ type: "layout-shift", buffered: true });

  const paintObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === "first-contentful-paint") {
        vitalsData.fcp = Math.round(entry.startTime);
      }
    }
  });
  paintObserver.observe({ type: "paint", buffered: true });

  const navTiming = performance.getEntriesByType("navigation")[0];
  if (navTiming) {
    vitalsData.ttfb = Math.round(
      navTiming.responseStart - navTiming.requestStart
    );
  }

  globalThis.addEventListener("load", () => {
    setTimeout(() => {
      reportVitals(vitalsData);
    }, 1000);
  });
}

/**
 * Store the vitals as one analytics event, which is a no-op without consent
 * @param {object} vitals - Collected LCP, FID, CLS, FCP and TTFB values
 * @returns {void}
 */
function reportVitals(vitals) {
  globalThis.analytics?.trackEvent(
    "Performance",
    "WebVitals",
    JSON.stringify(vitals)
  );
}
