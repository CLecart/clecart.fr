/**
 * Module optimisé pour la gestion des vidéos
 */
export function initVideoHandler() {
  const videos = document.querySelectorAll("video");
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Initialiser la gestion des vidéos après le chargement principal de la page
  window.addEventListener("load", () => {
    setupVideos();
  });

  function setupVideos() {
    videos.forEach((video) => {
      // Configuration commune
      video.setAttribute("playsinline", "");
      video.setAttribute("disablePictureInPicture", "");

      // Vérifier et corriger les sources vidéo si nécessaire
      const sources = video.querySelectorAll("source");
      sources.forEach((source) => {
        const src = source.getAttribute("src");
        if (src && src.includes("assets/images/") && src.endsWith(".mp4")) {
          // Corriger les références qui pointent encore vers assets/images/ au lieu de assets/videos/
          const correctedSrc = src.replace("assets/images/", "assets/videos/");
          source.setAttribute("src", correctedSrc);
          console.log(`Référence vidéo corrigée: ${src} -> ${correctedSrc}`);
        }
      });

      // Gestion du préchargement sur mobile
      if (isMobile) {
        if (video.hasAttribute("autoplay")) {
          video.removeAttribute("autoplay");
          video.setAttribute("preload", "metadata");
        }

        if (video.getAttribute("preload") === "auto") {
          video.setAttribute("preload", "metadata");
        }

        // Ajout d'un fond de chargement pour les vidéos
        addLoadingBackground(video);
      }

      // Observer l'intersection pour optimiser les performances
      observeVideoVisibility(video);

      // Gestion des interactions tactiles
      setupTouchInteractions(video);
    });
  }

  function addLoadingBackground(video) {
    const parent = video.parentElement;
    if (parent && parent.classList.contains("project-thumb") && !video.poster) {
      parent.style.backgroundColor = "#14141e";
    }
  }

  function observeVideoVisibility(video) {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Pauser les vidéos hors écran pour économiser des ressources
            if (!entry.isIntersecting && !video.paused) {
              video.pause();
            } else if (
              entry.isIntersecting &&
              video.paused &&
              video.hasAttribute("autoplay")
            ) {
              // Tenter de lire les vidéos autoplay lorsque visibles
              video.play().catch(() => {
                // Ignorer les erreurs de lecture automatique (restrictions navigateur)
              });
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(video);
    }
  }

  function setupTouchInteractions(video) {
    if (!isMobile) return;

    // Prévenir le plein écran non désiré sur mobile
    video.addEventListener("loadedmetadata", () => {
      if (!video.hasAttribute("autoplay")) {
        video.pause();
      }
    });

    // Toggle play/pause au toucher
    video.addEventListener(
      "touchstart",
      (e) => {
        if (e.target === video && !video.controls) {
          e.preventDefault();
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        }
      },
      { passive: false }
    );

    // Empêcher le zoom sur double-tap
    video.addEventListener("dblclick", (e) => {
      e.preventDefault();
      return false;
    });
  }
}
