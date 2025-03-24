/**
 * Module pour gérer le comportement des vidéos, optimisé pour mobile
 * Version: 2023-11-15
 */
export function initVideoHandler() {
  // Sélectionner toutes les vidéos
  const videos = document.querySelectorAll("video");
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  videos.forEach((video) => {
    // Configuration commune pour tous les appareils
    video.setAttribute("playsinline", ""); // Toujours ajouter playsinline
    video.setAttribute("disablePictureInPicture", ""); // Désactiver PiP

    // Remplacer l'autoplay par le chargement contrôlé si sur mobile
    if (isMobile && video.hasAttribute("autoplay")) {
      video.removeAttribute("autoplay");
      video.setAttribute("preload", "metadata");
    }

    // Éviter le préchargement complet sur mobile pour économiser la bande passante
    if (isMobile && video.getAttribute("preload") === "auto") {
      video.setAttribute("preload", "metadata");
    }

    // Ajouter un fond de couleur pendant le chargement
    if (!video.poster) {
      const parent = video.parentElement;
      if (parent && parent.classList.contains("project-thumb")) {
        parent.style.backgroundColor = "#14141e";
      }
    }

    // Gestion spécifique mobile
    if (isMobile) {
      // Bloquer l'auto-démarrage et prévenir le plein écran
      video.addEventListener("loadedmetadata", () => {
        if (!video.hasAttribute("autoplay")) {
          video.pause();
        }
      });

      // Remplacer le comportement tactile par défaut
      video.addEventListener(
        "touchstart",
        (e) => {
          if (e.target === video && !video.controls) {
            e.preventDefault(); // Ne pas déclencher le plein écran
            if (video.paused) {
              video.play();
            } else {
              video.pause();
            }
          }
        },
        { passive: false }
      );

      // Empêcher le zoom sur double tap
      video.addEventListener("dblclick", (e) => {
        e.preventDefault();
        return false;
      });
    }

    // Libérer les ressources vidéo quand elles ne sont plus visibles
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting && !video.paused) {
              video.pause();
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(video);
    }
  });
}
