/**
 * Google reCAPTCHA v2 for the contact form
 * @module Captcha
 * @description EmailJS refuses a message whose template requires reCAPTCHA unless it carries a solved token, which is what stops scripts that call its API directly, past the page and its trap field. Google is contacted only once a visitor who accepted the banner starts writing: nothing of it loads with the page.
 */

import { RECAPTCHA } from "../utils/config.js";

let widgetId = null;
let loading = null;

/**
 * Load Google's script once and draw the checkbox into a container
 * @function loadCaptcha
 * @description The script is added on first call and the promise kept, so focusing field after field loads it once. A failed load clears the promise: a later call tries again. The widget follows the page's theme and switches to Google's compact size where the normal one, 304px wide, would overflow the card.
 * @param {HTMLElement} container - Element the widget renders into
 * @returns {Promise<void>} Settles once the widget is drawn; rejects if the script cannot load
 */
export function loadCaptcha(container) {
  if (loading) {
    return loading;
  }

  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = RECAPTCHA.script;
    script.async = true;
    script.addEventListener("load", () => {
      globalThis.grecaptcha.ready(() => {
        widgetId = globalThis.grecaptcha.render(container, {
          sitekey: RECAPTCHA.siteKey,
          theme: document.documentElement.classList.contains("dark-mode")
            ? "dark"
            : "light",
          size: globalThis.matchMedia("(max-width: 400px)").matches
            ? "compact"
            : "normal",
        });
        resolve();
      });
    });
    script.addEventListener("error", () => {
      loading = null;
      script.remove();
      reject(new Error("reCAPTCHA could not be loaded"));
    });
    document.head.appendChild(script);
  });

  return loading;
}

/**
 * Read the token of a ticked checkbox
 * @function captchaToken
 * @returns {string} The token, or an empty string while the box is unticked, expired or not drawn
 */
export function captchaToken() {
  return widgetId === null ? "" : globalThis.grecaptcha.getResponse(widgetId);
}

/**
 * Untick the checkbox after a send: a token is valid for one verification only
 * @function resetCaptcha
 * @returns {void}
 */
export function resetCaptcha() {
  if (widgetId !== null) {
    globalThis.grecaptcha.reset(widgetId);
  }
}
