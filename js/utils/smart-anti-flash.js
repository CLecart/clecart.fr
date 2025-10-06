/**
 * @fileoverview Solution anti-flash élégante et respectueuse du design
 * @description Prévient les flashes blancs sans casser les styles existants
 * @version 1.0.0
 * @author Christophe Lecart <djlike@hotmail.fr>
 */

/**
 * Initialise le système anti-flash respectueux du design
 * @function initSmartAntiFlash
 * @description Solution non-intrusive qui preserve l'intégrité visuelle
 * @returns {void}
 * @example
 * // Activer la protection anti-flash intelligente
 * initSmartAntiFlash();
 */
export function initSmartAntiFlash() {
  /**
   * Détection et application intelligente du thème
   * @description Applique le thème sans forcer de styles
   */
  const applyThemeGracefully = () => {
    const savedTheme = localStorage.getItem("dark-mode");
    const isDarkMode = savedTheme !== "disabled";

    // Applique seulement les classes, pas de styles inline forcés
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.body.classList.remove("dark-mode");
    }
  };

  /**
   * Création d'un voile de transition temporaire
   * @description Overlay léger qui se retire après chargement
   */
  const createTransitionVeil = () => {
    // Vérifie si un voile existe déjà
    if (document.getElementById("transition-veil")) return;

    const veil = document.createElement("div");
    veil.id = "transition-veil";

    // Style minimal et non-intrusif
    const isDark = document.body.classList.contains("dark-mode");
    const bgColor = isDark ? "#121212" : "#ffffff";

    veil.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: ${bgColor};
      z-index: 9999;
      pointer-events: none;
      opacity: 1;
      transition: opacity 0.3s ease-out;
    `;

    // Insertion discrète
    document.body.appendChild(veil);

    // Suppression automatique après chargement
    const removeVeil = () => {
      veil.style.opacity = "0";
      setTimeout(() => {
        if (veil.parentNode) {
          veil.remove();
        }
      }, 300);
    };

    // Plusieurs points de suppression pour assurer la fiabilité
    if (document.readyState === "complete") {
      setTimeout(removeVeil, 100);
    } else {
      window.addEventListener("load", () => setTimeout(removeVeil, 100));
    }

    // Sécurité : suppression forcée après 2 secondes max
    setTimeout(removeVeil, 2000);
  };

  /**
   * Gestion intelligente des liens de navigation
   * @description Intercepte les navigations internes avec transition douce
   */
  const handleNavigationGracefully = () => {
    // Utilise une approche d'écoute globale plus performante
    document.addEventListener(
      "click",
      function (e) {
        const link = e.target.closest("a[href]");
        if (!link) return;

        const href = link.getAttribute("href");
        const isInternal =
          link.hostname === window.location.hostname ||
          href.startsWith("/") ||
          href.startsWith("./") ||
          href.startsWith("../");
        const isAnchor = href.startsWith("#");

        // Seuls les liens internes non-anchor sont traités
        if (isInternal && !isAnchor) {
          // Création d'un voile de transition uniquement si nécessaire
          requestAnimationFrame(() => {
            createTransitionVeil();
          });
        }
      },
      { passive: true }
    );
  };

  /**
   * Gestion des événements de navigation du navigateur
   * @description Gère les cas de retour/avant du navigateur
   */
  const handleBrowserNavigation = () => {
    // Gestion du pageshow pour les pages en cache
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) {
        // Réapplication douce du thème pour les pages en cache
        applyThemeGracefully();

        // Suppression de tout voile résiduel
        const existingVeil = document.getElementById("transition-veil");
        if (existingVeil) {
          existingVeil.remove();
        }
      }
    });

    // Préparation avant déchargement (optionnel et léger)
    window.addEventListener("beforeunload", function () {
      // Juste marquer la page comme en transition
      document.documentElement.classList.add("page-leaving");
    });
  };

  /**
   * Surveillance des changements de thème
   * @description Réagit aux changements de localStorage
   */
  const watchThemeChanges = () => {
    window.addEventListener("storage", function (e) {
      if (e.key === "dark-mode") {
        applyThemeGracefully();
      }
    });
  };

  // ===== INITIALISATION =====

  /**
   * Application initiale du thème
   */
  applyThemeGracefully();

  /**
   * Activation de tous les gestionnaires
   */
  handleNavigationGracefully();
  handleBrowserNavigation();
  watchThemeChanges();

  /**
   * Création du voile initial seulement si nécessaire
   * (pendant le chargement initial)
   */
  if (document.readyState === "loading") {
    createTransitionVeil();
  }
}

/**
 * Auto-initialisation intelligente
 * @description Se lance au moment optimal selon l'état de la page
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSmartAntiFlash);
} else {
  initSmartAntiFlash();
}
