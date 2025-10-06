/**
 * @fileoverview Système d'analytics respectueux de la vie privée
 * @description Analytics RGPD-compliant avec consentement utilisateur et données anonymisées
 * @version 1.0.0
 * @author Christophe Lecart <djlike@hotmail.fr>
 */

/**
 * Classe de gestion d'analytics privacy-first
 * @class PrivacyAnalytics
 * @description Collecte des métriques de performance et d'usage en respectant la vie privée
 * @example
 * // Initialiser l'analytics
 * const analytics = new PrivacyAnalytics();
 *
 * // Tracker un événement
 * analytics.trackEvent('Navigation', 'Click', 'Header Menu');
 */
class PrivacyAnalytics {
  /**
   * Constructeur de la classe PrivacyAnalytics
   * @constructor
   * @description Initialise les données de session et vérifie le consentement RGPD
   */
  constructor() {
    /**
     * Données de session utilisateur
     * @type {Object}
     * @property {number} startTime - Timestamp de début de session
     * @property {number} pageViews - Nombre de pages vues
     * @property {number} interactions - Nombre d'interactions utilisateur
     * @property {number} scrollDepth - Profondeur de scroll maximale (%)
     * @property {number} timeOnPage - Temps passé sur la page (ms)
     */
    this.sessionData = {
      startTime: Date.now(),
      pageViews: 0,
      interactions: 0,
      scrollDepth: 0,
      timeOnPage: 0,
    };

    /**
     * État du consentement RGPD
     * @type {boolean}
     * @description Vérifie si l'utilisateur a accepté le tracking
     */
    this.consentGiven = localStorage.getItem("gdpr-choice") === "accepted";

    if (this.consentGiven) {
      this.init();
    }
  }

  /**
   * Initialise tous les trackers d'analytics
   * @method init
   * @description Configure les event listeners et démarre la collecte de données
   * @returns {void}
   */
  init() {
    this.trackPageView();
    this.trackScrollDepth();
    this.trackInteractions();
    this.trackPerformance();

    /**
     * Envoi des données avant déchargement de la page
     * @description Utilise beforeunload pour capturer les sessions courtes
     */
    window.addEventListener("beforeunload", () => {
      this.sendAnalytics();
    });

    /**
     * Envoi périodique des données pour les sessions longues
     * @description Intervalle de 30 secondes pour éviter la perte de données
     */
    setInterval(() => {
      this.sendAnalytics();
    }, 30000);
  }

  /**
   * Enregistre une vue de page
   * @method trackPageView
   * @description Incrémente le compteur de pages vues pour la session
   * @returns {void}
   */
  trackPageView() {
    this.sessionData.pageViews++;
    console.log("Page view tracked:", window.location.pathname);
  }

  /**
   * Suit la profondeur de scroll de l'utilisateur
   * @method trackScrollDepth
   * @description Calcule le pourcentage de scroll maximum atteint
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
   * Enregistre un événement utilisateur personnalisé
   * @method trackEvent
   * @description Collecte des événements avec catégorisation pour analyse comportementale
   * @param {string} category - Catégorie de l'événement (ex: 'Navigation', 'Interaction')
   * @param {string} action - Action effectuée (ex: 'Click', 'Download')
   * @param {string|null} [label=null] - Label optionnel pour plus de contexte
   * @param {number|null} [value=null] - Valeur numérique associée à l'événement
   * @returns {void}
   * @example
   * // Tracker un clic sur bouton
   * trackEvent('UI', 'Button Click', 'Contact Form Submit');
   *
   * // Tracker un téléchargement avec valeur
   * trackEvent('Download', 'PDF', 'CV_Download', 1);
   */
  trackEvent(category, action, label = null, value = null) {
    if (!this.consentGiven) return;

    /**
     * Structure de données d'événement
     * @type {Object}
     * @property {string} category - Catégorie de l'événement
     * @property {string} action - Action effectuée
     * @property {string|null} label - Label descriptif
     * @property {number|null} value - Valeur numérique
     * @property {number} timestamp - Horodatage de l'événement
     * @property {string} url - URL de la page où l'événement s'est produit
     */
    const eventData = {
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      url: window.location.pathname,
    };

    console.log("Event tracked:", eventData);

    /**
     * Stockage local des événements pour envoi différé
     * @description Conserve les 50 derniers événements pour éviter la surcharge
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
    console.log("Analytics data ready to send:", analyticsData);

    // Clear sent events
    localStorage.removeItem("analytics_events");
  }

  /**
   * Met à jour le statut de consentement RGPD
   * @method updateConsent
   * @description Gère l'activation/désactivation du tracking selon le consentement
   * @param {boolean} hasConsent - État du consentement utilisateur
   * @returns {void}
   * @example
   * // Activer le tracking après consentement
   * analytics.updateConsent(true);
   *
   * // Désactiver et nettoyer les données
   * analytics.updateConsent(false);
   */
  updateConsent(hasConsent) {
    this.consentGiven = hasConsent;

    if (hasConsent && !this.initialized) {
      this.init();
      this.initialized = true;
    } else if (!hasConsent) {
      /**
       * Nettoyage des données analytics lors du retrait de consentement
       * @description Supprime toutes les données collectées et réinitialise la session
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
 * Export de la classe PrivacyAnalytics pour utilisation dans l'application principale
 * @exports PrivacyAnalytics
 */
export default PrivacyAnalytics;
