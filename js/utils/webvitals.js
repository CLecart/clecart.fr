/**
 * @fileoverview Système de monitoring et optimisation des Core Web Vitals
 * @description Surveillance en temps réel des métriques de performance web avec optimisations automatiques
 * @version 1.0.0
 * @author Christophe Lecart <djlike@hotmail.fr>
 */

/**
 * Initialise le monitoring des Core Web Vitals avec optimisations automatiques
 * @function initWebVitals
 * @description Configure la surveillance LCP, FID, CLS, FCP, TTFB avec déclenchement d'optimisations
 * @returns {void}
 * @example
 * // Activer le monitoring des Web Vitals
 * initWebVitals();
 */
export function initWebVitals() {
  /**
   * Vérification du support des APIs de performance
   * @description Validation de la compatibilité du navigateur avec PerformanceObserver
   */
  if (!("PerformanceObserver" in window)) {
    console.warn("PerformanceObserver not supported");
    return;
  }

  /**
   * Objet de stockage des données de métriques Web Vitals
   * @type {object}
   * @property {number|null} lcp - Largest Contentful Paint en millisecondes
   * @property {number|null} fid - First Input Delay en millisecondes
   * @property {number|null} cls - Cumulative Layout Shift (sans unité)
   * @property {number|null} fcp - First Contentful Paint en millisecondes
   * @property {number|null} ttfb - Time to First Byte en millisecondes
   */
  const vitalsData = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
  };

  /**
   * Monitoring du Largest Contentful Paint (LCP)
   * @description Surveille le temps de rendu du plus grand élément de contenu visible
   */
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    vitalsData.lcp = Math.round(lastEntry.startTime);

    /**
     * Déclenchement d'optimisations si LCP est mauvais (>2.5s)
     * @description Applique automatiquement des optimisations de chargement
     */
    if (vitalsData.lcp > 2500) {
      optimizeLCP();
    }

    console.log("LCP:", vitalsData.lcp + "ms");
  });
  lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

  /**
   * Monitoring du First Input Delay (FID)
   * @description Surveille le délai entre la première interaction utilisateur et la réponse
   */
  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      vitalsData.fid = Math.round(entry.processingStart - entry.startTime);

      /**
       * Déclenchement d'optimisations si FID est mauvais (>100ms)
       * @description Applique des optimisations de réactivité de l'interface
       */
      if (vitalsData.fid > 100) {
        optimizeFID();
      }

      console.log("FID:", vitalsData.fid + "ms");
    }
  });
  fidObserver.observe({ entryTypes: ["first-input"] });

  /**
   * Monitoring du Cumulative Layout Shift (CLS)
   * @description Surveille les décalages de mise en page non intentionnels
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
     * Déclenchement d'optimisations si CLS est mauvais (>0.1)
     * @description Applique des corrections de stabilité visuelle
     */
    if (vitalsData.cls > 0.1) {
      optimizeCLS();
    }

    console.log("CLS:", vitalsData.cls);
  });
  clsObserver.observe({ entryTypes: ["layout-shift"] });

  /**
   * Monitoring du First Contentful Paint (FCP)
   * @description Surveille le temps d'affichage du premier contenu visible
   */
  const navigationObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === "first-contentful-paint") {
        vitalsData.fcp = Math.round(entry.startTime);
        console.log("FCP:", vitalsData.fcp + "ms");
      }
    }
  });
  navigationObserver.observe({ entryTypes: ["paint"] });

  /**
   * Calcul du Time to First Byte (TTFB)
   * @description Mesure le temps de réponse initial du serveur
   */
  const navTiming = performance.getEntriesByType("navigation")[0];
  if (navTiming) {
    vitalsData.ttfb = Math.round(
      navTiming.responseStart - navTiming.requestStart
    );
    console.log("TTFB:", vitalsData.ttfb + "ms");
  }

  /**
   * Activation du monitoring des ressources pour optimisation
   * @description Surveille les performances de chargement des ressources
   */
  monitorResourceTiming();

  /**
   * Génération du rapport final des Web Vitals après chargement complet
   * @description Délai de 1s pour assurer la capture de toutes les métriques
   */
  window.addEventListener("load", () => {
    setTimeout(() => {
      reportVitals(vitalsData);
    }, 1000);
  });
}

/**
 * Optimise le Largest Contentful Paint (LCP)
 * @function optimizeLCP
 * @description Applique des optimisations de chargement pour améliorer le LCP
 * @returns {void}
 * @example
 * // Déclenchée automatiquement si LCP > 2.5s
 * optimizeLCP();
 */
function optimizeLCP() {
  console.warn("LCP is poor, applying optimizations...");

  /**
   * Préchargement des images candidates LCP
   * @description Convertit les 2 premières images lazy en eager loading
   */
  const images = document.querySelectorAll(
    'img[loading="lazy"]:not([data-optimized])'
  );
  images.forEach((img, index) => {
    if (index < 2) {
      /**
       * Optimisation pour les images au-dessus de la ligne de flottaison
       * @description Seules les 2 premières images sont optimisées
       */
      img.loading = "eager";
      img.setAttribute("data-optimized", "true");
    }
  });

  /**
   * Différement du CSS non critique
   * @description Charge le CSS non essentiel de manière asynchrone
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
 * Optimise le First Input Delay (FID)
 * @function optimizeFID
 * @description Améliore la réactivité en différant les tâches JavaScript lourdes
 * @returns {void}
 * @example
 * // Déclenchée automatiquement si FID > 100ms
 * optimizeFID();
 */
function optimizeFID() {
  console.warn("FID is poor, deferring JavaScript...");

  /**
   * Fractionnement des tâches longues avec Scheduler API
   * @description Utilise l'API scheduler moderne ou setTimeout en fallback
   */
  if ("scheduler" in window) {
    window.scheduler.postTask(
      () => {
        /**
         * Différement des calculs lourds en arrière-plan
         * @description Priorité background pour éviter le blocage de l'UI
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
