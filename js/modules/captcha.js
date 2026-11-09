/**
 * Google's invisible reCAPTCHA v2 for the contact form
 * @module Captcha
 * @description EmailJS refuses a message whose template requires reCAPTCHA unless it carries a solved token, which is what stops scripts that call its API directly, past the page and its trap field. Google is contacted only once a visitor who accepted the banner starts writing: nothing of it loads with the page. The check runs when the message is sent; only a visitor Google finds suspicious is shown a challenge.
 */

import { RECAPTCHA } from "../utils/config.js";

let widgetId = null;
let loading = null;
let pending = null;

/**
 * Settle the token request in flight, if any
 * @function settle
 * @param {string|null} token - The solved token, or null when Google reports an error or an expiry
 * @returns {void}
 */
function settle(token) {
  if (!pending) {
    return;
  }
  const { resolve, reject } = pending;
  pending = null;
  if (token) {
    resolve(token);
  } else {
    reject(new Error("reCAPTCHA could not verify this visit"));
  }
}

/**
 * Load Google's script once and draw the badge into a container
 * @function loadCaptcha
 * @description The script is added on first call and the promise kept, so focusing field after field loads it once. A failed load clears the promise: a later call tries again. The badge is drawn inline, in the place forms.css reserves for it beside the button, and follows the page's theme.
 * @param {HTMLElement} container - Element the badge renders into
 * @returns {Promise<void>} Settles once the badge is drawn; rejects if the script cannot load
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
          size: "invisible",
          badge: "inline",
          theme: document.documentElement.classList.contains("dark-mode")
            ? "dark"
            : "light",
          callback: (token) => settle(token),
          "expired-callback": () => settle(null),
          "error-callback": () => settle(null),
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
 * Run the invisible check and return its token
 * @function getCaptchaToken
 * @description Loads the badge first for a visitor who reached the button without entering a field. A token already solved and not yet used is returned as is.
 * @param {HTMLElement} container - Element the badge renders into
 * @returns {Promise<string>} The solved token; rejects if the script cannot load or Google reports an error
 */
export async function getCaptchaToken(container) {
  await loadCaptcha(container);
  const existing = globalThis.grecaptcha.getResponse(widgetId);
  if (existing) {
    return existing;
  }
  return new Promise((resolve, reject) => {
    pending = { resolve, reject };
    globalThis.grecaptcha.execute(widgetId);
  });
}

/**
 * Clear the token after a send: a token is valid for one verification only
 * @function resetCaptcha
 * @returns {void}
 */
export function resetCaptcha() {
  if (widgetId !== null) {
    globalThis.grecaptcha.reset(widgetId);
  }
}
