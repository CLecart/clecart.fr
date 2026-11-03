/**
 * Demo video playback
 * @module VideoHandler
 */

/**
 * Pause a video once it scrolls out of view, resume it on the way back
 * @function observeVideoVisibility
 * @description Decoding an offscreen video burns CPU and battery for a picture nobody sees. A video resumes only if this observer paused it, so one the visitor paused by hand stays paused. The one exception is a video that has never played yet: its autoplay attribute starts it on its first appearance, which covers a card revealed by View More. Without IntersectionObserver support nothing is bound and videos simply keep playing.
 * @param {HTMLVideoElement} video - Video to observe
 * @returns {void}
 */
function observeVideoVisibility(video) {
  if (!("IntersectionObserver" in globalThis)) {
    return;
  }

  let resumeOnReturn = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          if (!video.paused) {
            resumeOnReturn = true;
            video.pause();
          }
          return;
        }

        const neverPlayed =
          video.played.length === 0 && video.hasAttribute("autoplay");
        if (video.paused && (resumeOnReturn || neverPlayed)) {
          resumeOnReturn = false;
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
  const reduceMotion = globalThis.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  videos.forEach((video) => {
    video.setAttribute("playsinline", "");
    video.setAttribute("disablepictureinpicture", "");

    /* A video that will not start by itself loads nothing until it is played:
       its poster, a still of the demo as a small WebP, stands in. On a phone that
       spares the data; under reduced motion, the loop. The poster is only set
       here, so a desktop visitor whose video plays on arrival never fetches it. */
    if ((isMobile || reduceMotion) && video.hasAttribute("autoplay")) {
      video.removeAttribute("autoplay");
      video.pause();
      video.preload = "none";
      if (video.dataset.poster) {
        video.poster = video.dataset.poster;
      }
    }

    observeVideoVisibility(video);
  });
}
