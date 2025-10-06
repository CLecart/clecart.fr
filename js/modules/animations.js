/**
 * @fileoverview Système d'animations et effets visuels intelligents
 * @description Gestion des animations d'apparition, transitions et effets basés sur l'intersection
 * @version 1.0.0
 * @author Christophe Lecart <djlike@hotmail.fr>
 */

/**
 * Initialise le système d'animations basé sur l'Intersection Observer
 * @function initAnimations
 * @description Configure les observateurs pour déclencher les animations au scroll
 * @returns {void}
 * @example
 * // Activer les animations de page
 * initAnimations();
 */
export function initAnimations() {
  /**
   * Factory pour créer des observateurs d'intersection configurables
   * @function createObserver
   * @param {function} callback - Fonction de rappel pour les entrées observées
   * @param {object} options - Options personnalisées pour l'observateur
   * @returns {IntersectionObserver} Instance d'observateur configurée
   * @description Simplifie la création d'observateurs avec options par défaut optimales
   */
  const createObserver = (callback, options = {}) => {
    return new IntersectionObserver(
      callback,
      Object.assign(
        {
          root: null,
          threshold: 0.1,
          rootMargin: "-10% 0px -10% 0px",
        },
        options
      )
    );
  };

  /**
   * Observateur principal pour les animations d'apparition
   * @description Déclenche la classe 'appear' lors de l'intersection avec le viewport
   */
  const observer = createObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");

        /**
         * Optimisation : unobserve après animation pour les cartes de projet
         * @description Évite les calculs inutiles après la première animation
         */
        if (
          entry.target.classList.contains("project-card") ||
          entry.target.closest("#projects")
        ) {
          observer.unobserve(entry.target);
        }
      }
    });
  });

  /**
   * Observateur spécialisé pour les en-têtes de section
   * @description Applique l'animation 'title-animate' aux titres de section
   */
  const sectionHeaderObserver = createObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("title-animate");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "-10% 0px" }
  );

  /**
   * Observateur pour l'activation des sections avec détection de direction
   * @description Gère l'état actif des sections et la direction du défilement
   */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        /**
         * Détection de la direction de défilement
         * @description Analyse la position pour déterminer le sens de navigation
         */
        const direction = entry.boundingClientRect.y < 0 ? "up" : "down";

        if (entry.isIntersecting) {
          entry.target.classList.add("section-active");
          entry.target.setAttribute("data-scroll-direction", direction);
        } else {
          entry.target.classList.remove("section-active");
        }
      });
    },
    {
      root: null,
      rootMargin: "-20% 0px",
      threshold: 0.1,
    }
  );

  /**
   * Application des observateurs sur les éléments animés
   * @description Sélectionne et observe tous les éléments avec classes d'animation
   */
  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-left, .slide-right, .project.description.card-base"
  );
  animatedElements.forEach((element) => observer.observe(element));

  /**
   * Observation des en-têtes de section pour animations spéciales
   * @description Cible les titres des sections skills et projects
   */
  const sectionHeaders = document.querySelectorAll(
    "#skills .section-header h2, #projects .section-header h2"
  );
  sectionHeaders.forEach((header) => sectionHeaderObserver.observe(header));

  /**
   * Traitement spécial pour la page de navigation des projets
   * @description Ajoute automatiquement les classes d'animation aux cartes
   */
  if (document.querySelector(".project-navigation")) {
    document.querySelectorAll(".project.description").forEach((card) => {
      card.classList.add("fade-in");
    });
  }

  /**
   * Initialisation des animations spéciales pour les détails de portfolio
   * @description Déclenche la fonction spécialisée si la page le nécessite
   */
  if (document.querySelector(".portfolio-details")) {
    handlePortfolioDetailsAnimations();
  }

  /**
   * Gestion avancée des animations pour les pages de détails de portfolio
   * @function handlePortfolioDetailsAnimations
   * @description Configure des animations spécialisées pour les sections de portfolio
   * @returns {void}
   */
  function handlePortfolioDetailsAnimations() {
    /**
     * Configuration de l'observateur pour les sections de portfolio
     * @description Anime les sections avec leurs éléments enfants séquentiellement
     */
    const portfolioSections = document.querySelectorAll(".portfolio-section");

    const portfolioObserver = createObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear", "section-active");

            /**
             * Animation séquentielle des résultats/outcomes
             * @description Déclenche l'animation des listes d'éléments avec délai
             */
            animateChildElements(
              entry.target,
              ".outcomes-list li",
              "appear-outcome"
            );
          }
        });
      },
      { threshold: 0.15, rootMargin: "-10% 0px" }
    );

    portfolioSections.forEach((section) => portfolioObserver.observe(section));

    /**
     * Animation spéciale pour la section call-to-action
     * @description Observer dédié avec seuil élevé pour effet dramatique
     */
    const ctaSection = document.querySelector(".cta-section");
    if (ctaSection) {
      createObserver(
        (entries) =>
          entries[0].isIntersecting &&
          entries[0].target.classList.add("appear"),
        { threshold: 0.5 }
      ).observe(ctaSection);
    }

    /**
     * Utilitaire d'animation séquentielle pour éléments enfants
     * @function animateChildElements
     * @param {Element} parent - Élément parent contenant les enfants à animer
     * @param {string} selector - Sélecteur CSS pour les enfants cibles
     * @param {string} className - Classe CSS à ajouter pour l'animation
     * @returns {void}
     * @description Anime les éléments enfants avec un délai progressif de 100ms
     */
    function animateChildElements(parent, selector, className) {
      const elements = parent.querySelectorAll(selector);
      elements.forEach((item, index) => {
        setTimeout(() => item.classList.add(className), 100 * index);
      });
    }
  }
}

/**
 * Effet machine à écrire dynamique pour l'élément typewriter
 * @function initTypewriterEffect
 * @description Crée un effet de frappe animé avec cycle de mots et vitesses variables
 * @returns {void}
 * @example
 * // Activer l'effet typewriter sur #typewriter
 * initTypewriterEffect();
 */
export function initTypewriterEffect() {
  const typewriterElement = document.getElementById("typewriter");
  if (!typewriterElement) return;

  /**
   * Liste des mots à afficher en rotation
   * @constant {string[]}
   * @description Termes professionnels affichés séquentiellement
   */
  const words = [
    "Web Developer",
    "Mobile Developer",
    "UI Designer",
    "Problem Solver",
  ];

  /**
   * Variables d'état pour l'animation typewriter
   * @description Contrôlent la progression de l'effet de frappe
   */
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  /**
   * Fonction récursive d'animation de frappe
   * @function type
   * @description Gère l'ajout/suppression de caractères avec timing variable
   * @returns {void}
   */
  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      /**
       * Mode suppression : retire les caractères rapidement
       * @description Vitesse accélérée pour l'effacement (50ms)
       */
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      /**
       * Mode écriture : ajoute les caractères progressivement
       * @description Vitesse normale pour la frappe (100ms)
       */
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    /**
     * Gestion des transitions entre modes écriture/suppression
     * @description Logique de basculement avec pauses appropriées
     */
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 1000; // Pause après mot complet
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // Pause avant nouveau mot
    }

    setTimeout(type, typeSpeed);
  }

  /**
   * Démarrage de l'effet avec délai initial
   * @description Permet le chargement complet avant début de l'animation
   */
  setTimeout(type, 1000);
}
