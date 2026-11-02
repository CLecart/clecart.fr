/**
 * Demo video playback
 * @module VideoHandler
 */

/**
 * Pause a video once it scrolls out of view, resume it on the way back
 * @function observeVideoVisibility
 * @description Decoding an offscreen video burns CPU and battery for a picture nobody sees. Resuming is gated on the autoplay attribute, so a video the visitor paused by hand is never restarted behind their back — and because setupVideos strips autoplay on mobile, playback there stays entirely manual. Without IntersectionObserver support nothing is bound and videos simply keep playing.
 * @param {HTMLVideoElement} video - Video to observe
 * @returns {void}
 */
function observeVideoVisibility(video) {
  if ("IntersectionObserver" in globalThis) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
          } else if (
            entry.isIntersecting &&
            video.paused &&
            video.hasAttribute("autoplay")
          ) {
            video
              .play()
              .catch((error) => console.warn("Autoplay was blocked:", error));
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(video);
  }
}

/**
 * On mobile, keep videos paused until tapped, and let a tap toggle playback
 * @param {HTMLVideoElement} video - Video element to setup
 * @param {boolean} isMobile - Whether the device is mobile
 */
function setupTouchInteractions(video, isMobile) {
  if (!isMobile) {
    return;
  }

  video.addEventListener("loadedmetadata", () => {
    if (!video.hasAttribute("autoplay")) {
      video.pause();
    }
  });

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

  video.addEventListener("dblclick", (e) => {
    e.preventDefault();
  });
}

/**
 * Prepare every video on the page for mobile constraints and offscreen pausing
 * @function initVideoHandler
 * @description Runs synchronously: main.js already calls this from a load
 * handler, and re-registering a load listener here would never fire — the DOM
 * does not invoke listeners added while the event it listens for is dispatching,
 * and load only happens once. The video list is captured at call time, so markup
 * injected later is not covered. Mobile is detected from the user agent string,
 * which is unreliable by nature: every decision it drives is a data-saving
 * default, never a feature gate.
 * @returns {void}
 */
export function initVideoHandler() {
  const videos = document.querySelectorAll("video");
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  /**
   * Normalise each video's attributes and attach its observers
   * @function setupVideos
   * @description playsinline stops iOS from hijacking playback into fullscreen. On mobile, autoplay is stripped and preload capped at metadata, so a visitor on cellular data never pays for a video they did not ask to watch.
   * @returns {void}
   */
  function setupVideos() {
    videos.forEach((video) => {
      video.setAttribute("playsinline", "");
      video.setAttribute("disablePictureInPicture", "");

      if (isMobile && video.hasAttribute("autoplay")) {
        video.removeAttribute("autoplay");
        video.setAttribute("preload", "metadata");
      }

      observeVideoVisibility(video);

      setupTouchInteractions(video, isMobile);
    });
  }

  setupVideos();
}
