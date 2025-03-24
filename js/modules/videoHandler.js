/**
 * Module pour gérer le comportement des vidéos, en particulier sur mobile
 */
export function initVideoHandler() {
  // Sélectionner toutes les vidéos
  const videos = document.querySelectorAll(".mobile-friendly-video");

  // Empêcher le mode plein écran automatique sur mobile
  videos.forEach((video) => {
    // Remplacer autoplay par un chargement contrôlé
    if (video.hasAttribute("autoplay")) {
      video.removeAttribute("autoplay");
    }

    // Pour les appareils mobiles
    if (
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // Ajouter l'attribut playsinline s'il n'existe pas déjà
      if (!video.hasAttribute("playsinline")) {
        video.setAttribute("playsinline", "");
      }

      // Ajouter l'attribut disablePictureInPicture pour iOS
      video.setAttribute("disablePictureInPicture", "");

      // Permettre de démarrer la lecture seulement sur tap explicite
      video.addEventListener("loadedmetadata", () => {
        video.pause();
      });

      // Désactiver le comportement par défaut pour l'événement touchstart
      video.addEventListener(
        "touchstart",
        (e) => {
          // Permettre les contrôles mais éviter le comportement par défaut du navigateur
          if (e.target === video) {
            e.preventDefault();
          }
        },
        { passive: false }
      );
    }

    // Gestion du clic sur la miniature
    const thumb = video.closest(".project-thumb");
    if (thumb) {
      thumb.addEventListener("click", (e) => {
        // Éviter le mode plein écran si on clique sur la vidéo elle-même
        if (e.target === video) {
          return;
        }
        // Autrement, jouer/pauser la vidéo
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });
    }
  });
}
