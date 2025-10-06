// analytics.js - Privacy-friendly analytics
class PrivacyAnalytics {
  constructor() {
    this.sessionData = {
      startTime: Date.now(),
      pageViews: 0,
      interactions: 0,
      scrollDepth: 0,
      timeOnPage: 0,
    };

    this.consentGiven = localStorage.getItem("gdpr-choice") === "accepted";

    if (this.consentGiven) {
      this.init();
    }
  }

  init() {
    this.trackPageView();
    this.trackScrollDepth();
    this.trackInteractions();
    this.trackPerformance();

    // Send data before page unload
    window.addEventListener("beforeunload", () => {
      this.sendAnalytics();
    });

    // Send data every 30 seconds for long sessions
    setInterval(() => {
      this.sendAnalytics();
    }, 30000);
  }

  trackPageView() {
    this.sessionData.pageViews++;
    console.log("Page view tracked:", window.location.pathname);
  }

  trackScrollDepth() {
    let maxScroll = 0;

    window.addEventListener("scroll", () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100
      );

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        this.sessionData.scrollDepth = maxScroll;
      }
    });
  }

  trackInteractions() {
    const interactionEvents = ["click", "keydown", "touch"];

    interactionEvents.forEach((event) => {
      document.addEventListener(
        event,
        () => {
          this.sessionData.interactions++;
        },
        { passive: true }
      );
    });
  }

  trackPerformance() {
    if ("PerformanceObserver" in window) {
      // Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            this.sessionData.lcp = Math.round(entry.startTime);
          }

          if (entry.entryType === "first-input") {
            this.sessionData.fid = Math.round(
              entry.processingStart - entry.startTime
            );
          }

          if (entry.entryType === "layout-shift" && !entry.hadRecentInput) {
            this.sessionData.cls = (this.sessionData.cls || 0) + entry.value;
          }
        }
      });

      observer.observe({
        entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"],
      });
    }
  }

  trackEvent(category, action, label = null, value = null) {
    if (!this.consentGiven) return;

    const eventData = {
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      url: window.location.pathname,
    };

    console.log("Event tracked:", eventData);

    // Store in local storage for later sending
    const events = JSON.parse(localStorage.getItem("analytics_events") || "[]");
    events.push(eventData);
    localStorage.setItem("analytics_events", JSON.stringify(events.slice(-50))); // Keep last 50 events
  }

  sendAnalytics() {
    if (!this.consentGiven) return;

    this.sessionData.timeOnPage = Date.now() - this.sessionData.startTime;

    const analyticsData = {
      session: this.sessionData,
      events: JSON.parse(localStorage.getItem("analytics_events") || "[]"),
      userAgent: navigator.userAgent,
      screen: {
        width: screen.width,
        height: screen.height,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      connection: navigator.connection
        ? {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
          }
        : null,
      timestamp: Date.now(),
    };

    // In real implementation, send to your analytics endpoint
    console.log("Analytics data ready to send:", analyticsData);

    // Clear sent events
    localStorage.removeItem("analytics_events");
  }

  updateConsent(hasConsent) {
    this.consentGiven = hasConsent;

    if (hasConsent && !this.initialized) {
      this.init();
      this.initialized = true;
    } else if (!hasConsent) {
      // Clear analytics data
      localStorage.removeItem("analytics_events");
      this.sessionData = {
        startTime: Date.now(),
        pageViews: 0,
        interactions: 0,
        scrollDepth: 0,
        timeOnPage: 0,
      };
    }
  }
}

// Export for use in main application
export default PrivacyAnalytics;
