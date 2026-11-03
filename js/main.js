/**
 * Entry point of the site's pages, and the one module that calls every init*()
 * @description It runs on import, as js/cv.js does for /cv/; every other module only exports.
 * @author Christophe Lecart
 */

document.documentElement.classList.remove("no-js");

import { initDarkMode } from "./modules/darkmode.js";
import { initNavigation } from "./modules/navigation.js";
import { initAnimations, initTypewriterEffect } from "./modules/animations.js";
import { initContactForm } from "./modules/contact-form.js";
import { initProjectNavigation } from "./modules/project-navigation.js";
import { initVideoHandler } from "./modules/video-handler.js";
import { initViewMoreProjects } from "./modules/view-more.js";
import { initGDPRBanner } from "./utils/gdpr.js";
import { registerServiceWorker } from "./utils/sw-register.js";

/**
 * Run each init on its own, so one that throws does not stop the others
 * @function runAll
 * @description The inits share one callback per phase: an exception in any of them used to abort every init after it, which left the page half-wired. Each failure is still reported in the console.
 * @param {Array<Function>} inits - Init functions, in the order they must run
 * @returns {void}
 */
function runAll(inits) {
  inits.forEach((init) => {
    try {
      init();
    } catch (error) {
      console.error(`${init.name} failed:`, error);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  runAll([initDarkMode, initNavigation]);

  requestAnimationFrame(() =>
    runAll([
      initAnimations,
      initTypewriterEffect,
      initGDPRBanner,
      initContactForm,
      initProjectNavigation,
      initViewMoreProjects,
    ])
  );

  globalThis.addEventListener("load", () =>
    runAll([initVideoHandler, registerServiceWorker])
  );
});
