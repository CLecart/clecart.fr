/**
 * Production-ready logging utility
 * @description Conditional logging based on environment
 */

const Logger = {
  /**
   * Check if we're in development mode
   * @returns {boolean} True if in development
   */
  isDevelopment() {
    return (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.startsWith("192.168.") ||
      window.location.search.includes("debug=true")
    );
  },

  /**
   * Log information messages
   * @param {string} message - Message to log
   * @param {...any} args - Additional arguments
   */
  log(message, ...args) {
    if (this.isDevelopment()) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },

  /**
   * Log warning messages
   * @param {string} message - Warning message
   * @param {...any} args - Additional arguments
   */
  warn(message, ...args) {
    if (this.isDevelopment()) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },

  /**
   * Log error messages (always shown)
   * @param {string} message - Error message
   * @param {...any} args - Additional arguments
   */
  error(message, ...args) {
    console.error(`[ERROR] ${message}`, ...args);
  },

  /**
   * Log performance metrics
   * @param {string} metric - Metric name
   * @param {any} value - Metric value
   */
  performance(metric, value) {
    if (this.isDevelopment()) {
      console.log(`[PERF] ${metric}:`, value);
    }
  },
};

export default Logger;
