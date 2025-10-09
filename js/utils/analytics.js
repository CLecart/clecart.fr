/**
 * Privacy-first analytics system
 * @fileoverview GDPR-compliant analytics with user consent and anonymized data
 * @author Christophe Lecart
 */

/**
 * Privacy-first analytics management class
 * @class PrivacyAnalytics
 * @description Collects performance and usage metrics while respecting privacy
 * @example
 * const analytics = new PrivacyAnalytics();
 * analytics.trackEvent('Navigation', 'Click', 'Header Menu');
 */
class PrivacyAnalytics {
  /**
   * PrivacyAnalytics class constructor
   * @constructor
   * @description Initializes session data and checks GDPR consent
   */
  constructor() {
    /**
     * User session data
     * @type {Object}
     * @property {number} startTime - Session start timestamp
     * @property {number} pageViews - Number of page views
     * @property {number} interactions - Number of user interactions
     * @property {number} scrollDepth - Maximum scroll depth (%)
     * @property {number} timeOnPage - Time spent on page (ms)
     */
    this.sessionData = {
      startTime: Date.now(),
      pageViews: 0,
      interactions: 0,
      scrollDepth: 0,
      timeOnPage: 0,
    };

    /**
     * GDPR consent status
     * @type {boolean}
     * @description Checks if user has accepted tracking
     */
    this.consentGiven = localStorage.getItem("gdpr-choice") === "accepted";

    if (this.consentGiven) {
      this.init();
    }
  }

  /**
   * Initializes all analytics trackers
   * @method init
   * @description Sets up event listeners and starts data collection
   * @returns {void}
   */
  init() {
    this.trackPageView();
    this.trackScrollDepth();
    this.trackInteractions();
    this.trackPerformance();

    /**
     * Send data before page unload
     * @description Uses beforeunload to capture short sessions
     */
    window.addEventListener("beforeunload", () => {
      this.sendAnalytics();
    });

    /**
     * Periodic data sending for long sessions
     * @description 30-second interval to prevent data loss
     */
    setInterval(() => {
      this.sendAnalytics();
    }, 30000);
  }

  /**
   * Records a page view
   * @method trackPageView
   * @description Increments page view counter for session
   * @returns {void}
   */
  trackPageView() {
    this.sessionData.pageViews++;
  }

  /**
   * Tracks user scroll depth
   * @method trackScrollDepth
   * @description Calculates maximum scroll percentage reached
   * @returns {void}
   */
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

  /**
   * Records a custom user event
   * @method trackEvent
   * @description Collects categorized events for behavioral analysis
   * @param {string} category - Event category (e.g., 'Navigation', 'Interaction')
   * @param {string} action - Action performed (e.g., 'Click', 'Download')
   * @param {string|null} [label=null] - Optional label for additional context
   * @param {number|null} [value=null] - Numeric value associated with event
   * @returns {void}
   * @example
   * trackEvent('UI', 'Button Click', 'Contact Form Submit');
   * trackEvent('Download', 'PDF', 'CV_Download', 1);
   */
  trackEvent(category, action, label = null, value = null) {
    if (!this.consentGiven) return;

    /**
     * Event data structure
     * @type {Object}
     * @property {string} category - Event category
     * @property {string} action - Action performed
     * @property {string|null} label - Descriptive label
     * @property {number|null} value - Numeric value
     * @property {number} timestamp - Event timestamp
     * @property {string} url - Page URL where event occurred
     */
    const eventData = {
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      url: window.location.pathname,
    };

    /**
     * Local storage of events for deferred sending
     * @description Keeps last 50 events to avoid overload
     */
    const events = JSON.parse(localStorage.getItem("analytics_events") || "[]");
    events.push(eventData);
    localStorage.setItem("analytics_events", JSON.stringify(events.slice(-50)));
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
    // Clear sent events
    localStorage.removeItem("analytics_events");
  }

  /**
   * Updates GDPR consent status
   * @method updateConsent
   * @description Manages tracking activation/deactivation based on consent
   * @param {boolean} hasConsent - User consent status
   * @returns {void}
   * @example
   * analytics.updateConsent(true);
   * analytics.updateConsent(false);
   */
  updateConsent(hasConsent) {
    this.consentGiven = hasConsent;

    if (hasConsent && !this.initialized) {
      this.init();
      this.initialized = true;
    } else if (!hasConsent) {
      /**
       * Analytics data cleanup on consent withdrawal
       * @description Removes all collected data and resets session
       */
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

/**
 * Export PrivacyAnalytics class for main application use
 * @exports PrivacyAnalytics
 */
export default PrivacyAnalytics;
