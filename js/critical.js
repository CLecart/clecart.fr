// critical.js - Critical path JavaScript inlined in HTML head
// This loads immediately to prevent FOUC and setup essential functionality

(function () {
  "use strict";

  // Prevent FOUC - remove js-loading class as soon as possible
  document.documentElement.classList.remove("js-loading");

  // Critical theme detection - must be sync to prevent flash
  const isDarkMode = localStorage.getItem("dark-mode") !== "disabled";
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }

  // Critical performance - preload key resources
  const preloadResources = [
    "/assets/icons/android-chrome-192x192.png",
    "/css/components/dark-mode-toggle.css",
    "/js/modules/darkmode.js",
  ];

  preloadResources.forEach((resource) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = resource.endsWith(".css")
      ? "style"
      : resource.endsWith(".js")
        ? "script"
        : "image";
    link.href = resource;
    document.head.appendChild(link);
  });

  // Performance observer for Core Web Vitals
  if ("PerformanceObserver" in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "largest-contentful-paint") {
          console.log("LCP:", entry.startTime);
        }
        if (entry.entryType === "first-input-delay") {
          console.log("FID:", entry.processingStart - entry.startTime);
        }
        if (entry.entryType === "layout-shift") {
          if (!entry.hadRecentInput) {
            console.log("CLS:", entry.value);
          }
        }
      }
    });

    observer.observe({
      entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"],
    });
  }
})();
