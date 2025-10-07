/**
 * Video handler module with intersection observer and lazy loading
 * @module VideoHandler
 */
export function initVideoHandler() {
  const videos = document.querySelectorAll("video");
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  window.addEventListener("load", () => {
    setupVideos();
  });

  function setupVideos() {
    videos.forEach((video) => {
      video.setAttribute("playsinline", "");
      video.setAttribute("disablePictureInPicture", "");

      const sources = video.querySelectorAll("source");
      sources.forEach((source) => {
        const src = source.getAttribute("src");
        if (src && src.includes("assets/images/") && src.endsWith(".mp4")) {
          const correctedSrc = src.replace("assets/images/", "assets/videos/");
          source.setAttribute("src", correctedSrc);
        }
      });

      if (isMobile) {
        if (video.hasAttribute("autoplay")) {
          video.removeAttribute("autoplay");
          video.setAttribute("preload", "metadata");
        }

        if (video.getAttribute("preload") === "auto") {
          video.setAttribute("preload", "metadata");
        }

        addLoadingBackground(video);
      }

      if (video.dataset.src && !video.src) {
        observeLazyLoad(video);
      } else {
        observeVideoVisibility(video);
      }

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
            if (!entry.isIntersecting && !video.paused) {
              video.pause();
            } else if (
              entry.isIntersecting &&
              video.paused &&
              video.hasAttribute("autoplay")
            ) {
              video.play().catch(() => {});
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(video);
    }
  }

  function observeLazyLoad(video) {
    if ("IntersectionObserver" in window) {
      const lazyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (video.dataset.src) {
                video.src = video.dataset.src;
                video.removeAttribute("data-src");
              }

              if (video.querySelector("source[data-src]")) {
                const sources = video.querySelectorAll("source[data-src]");
                sources.forEach((source) => {
                  source.src = source.dataset.src;
                  source.removeAttribute("data-src");
                });
                video.load();
              }

              lazyObserver.unobserve(video);
              observeVideoVisibility(video);
            }
          });
        },
        { rootMargin: "200px" }
      );
      lazyObserver.observe(video);
    }
  }

  /**
   * Setup touch interactions for mobile devices
   * @param {HTMLVideoElement} video - Video element to setup
   */
  function setupTouchInteractions(video) {
    if (!isMobile) return;

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
      return false;
    });
  }
}
