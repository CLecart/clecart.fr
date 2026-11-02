/**
 * Consent-gated analytics that never leaves the browser
 * @author Christophe Lecart
 */

import { getConsentStatus } from "./gdpr.js";

/**
 * Session counters and a localStorage event buffer, both inert without consent
 * @class PrivacyAnalytics
 */
class PrivacyAnalytics {
  /**
   * Start collecting at once when consent was stored on an earlier visit
   * @class
   */
  constructor() {
    this.sessionData = {
      startTime: Date.now(),
      pageViews: 0,
      interactions: 0,
      scrollDepth: 0,
      timeOnPage: 0,
    };

    this.consentGiven = getConsentStatus() === "accepted";
    this.initialized = false;

    if (this.consentGiven) {
      this.init();
      this.initialized = true;
    }
  }

  /**
   * Bind the counters and schedule the buffer flushes
   * @function init
   * @returns {void}
   */
  init() {
    this.trackPageView();
    this.trackScrollDepth();
    this.trackInteractions();

    globalThis.addEventListener("beforeunload", () => {
      this.flushEvents();
    });

    /* 30s interval bounds how long events sit in localStorage on long
       sessions, where beforeunload may never fire. */
    setInterval(() => {
      this.flushEvents();
    }, 30000);
  }

  /**
   * Count one page view for this document
   * @function trackPageView
   * @returns {void}
   */
  trackPageView() {
    this.sessionData.pageViews++;
  }

  /**
   * Keep the deepest scroll reached, as a percentage of the scrollable height
   * @function trackScrollDepth
   * @returns {void}
   */
  trackScrollDepth() {
    let maxScroll = 0;

    globalThis.addEventListener("scroll", () => {
      const scrollPercent = Math.round(
        (globalThis.scrollY /
          (document.body.scrollHeight - globalThis.innerHeight)) *
          100
      );

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        this.sessionData.scrollDepth = maxScroll;
      }
    });
  }

  /**
   * Count clicks and key presses; a tap on a touch screen fires click too
   * @function trackInteractions
   * @returns {void}
   */
  trackInteractions() {
    ["click", "keydown"].forEach((event) => {
      document.addEventListener(event, () => {
        this.sessionData.interactions++;
      });
    });
  }

  /**
   * Append an event to the buffer, keeping the latest 50; a no-op without consent
   * @function trackEvent
   * @param {string} category - Event category (e.g., 'Navigation', 'Interaction')
   * @param {string} action - Action performed (e.g., 'Click', 'Download')
   * @param {string|null} [label=null] - Optional label for additional context
   * @param {number|null} [value=null] - Numeric value associated with event
   * @returns {void}
   */
  trackEvent(category, action, label = null, value = null) {
    if (!this.consentGiven) {
      return;
    }

    const eventData = {
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      url: globalThis.location.pathname,
    };

    const events = JSON.parse(localStorage.getItem("analytics_events") || "[]");
    events.push(eventData);
    localStorage.setItem("analytics_events", JSON.stringify(events.slice(-50)));
  }

  /**
   * Discard the buffered events and record the time spent on the page
   * @function flushEvents
   * @description No analytics endpoint is configured, so nothing leaves the
   * browser: events are buffered in localStorage and dropped here. Wiring an
   * endpoint means sending the buffer from this method and updating
   * privacy-policy.html to match.
   * @returns {void}
   */
  flushEvents() {
    if (!this.consentGiven) {
      return;
    }

    this.sessionData.timeOnPage = Date.now() - this.sessionData.startTime;
    localStorage.removeItem("analytics_events");
  }

  /**
   * Start collecting on the first grant; on withdrawal, drop the buffer and reset the counters
   * @function updateConsent
   * @param {boolean} hasConsent - User consent status
   * @returns {void}
   */
  updateConsent(hasConsent) {
    this.consentGiven = hasConsent;

    if (hasConsent && !this.initialized) {
      this.init();
      this.initialized = true;
    } else if (!hasConsent) {
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

  /**
   * Grant consent; safe to call when collection has already started
   * @function enableTracking
   * @description Counterpart to disableTracking, called by the consent banner.
   * Guarded by the initialized flag: the constructor already starts collection
   * when consent was stored on a previous visit, and a second init() would
   * bind every listener and interval twice.
   * @returns {void}
   */
  enableTracking() {
    this.updateConsent(true);
  }

  /**
   * Withdraw consent: the buffer is erased and the counters start over
   * @function disableTracking
   * @returns {void}
   */
  disableTracking() {
    this.updateConsent(false);
  }
}

export default PrivacyAnalytics;
