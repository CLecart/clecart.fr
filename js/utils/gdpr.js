/**
 * Consent banner, and the one reader of the visitor's decision
 * @module GDPR
 */

import { readStored, removeStored, writeStored } from "./storage.js";

/**
 * Read back the consent decision recorded for this visitor
 * @function getConsentStatus
 * @description The only place consent is read: every module that gates on it calls this, so the fallback to the legacy gdpr-choice key lives here alone. That fallback honours a decision taken before the rename instead of re-prompting someone who already answered. Returns null when nothing was recorded, letting the caller tell "never asked" apart from an explicit decision.
 * @returns {string|null} The recorded decision, or null when the visitor has not answered
 */
export function getConsentStatus() {
  return readStored("gdpr-consent") ?? readStored("gdpr-choice");
}

/**
 * Build the consent banner and append it to the page
 * @function buildBanner
 * @description Built here rather than written into each page, so every page shows the same wording and none can ship without it. An aside with a name, so the banner is a landmark of its own instead of loose content outside every region. It is fixed to the bottom of the screen but placed right after the skip link in the markup, so the keyboard reaches its choice second, not after the whole page. The link is root-absolute because 404.html is served at any depth, where a relative one would point under the missing path.
 * @returns {{banner: HTMLElement, acceptBtn: HTMLElement, declineBtn: HTMLElement}} The banner and its two action buttons
 */
function buildBanner() {
  const banner = document.createElement("aside");
  banner.id = "gdpr-banner";
  banner.className = "gdpr-banner hidden";
  banner.setAttribute("aria-label", "Privacy choices");
  banner.innerHTML = `
    <div class="gdpr-content">
      <p>
        Accepting lets the contact form send your message through EmailJS.
        Until then, the form sends nothing. Details in the
        <a href="/privacy-policy.html">privacy policy</a>.
      </p>
      <div class="gdpr-buttons">
        <button type="button" id="gdpr-accept" class="btn">Accept</button>
        <button type="button" id="gdpr-decline" class="btn btn-secondary">Decline</button>
      </div>
    </div>
  `;
  const skipLink = document.querySelector(".skip-link");
  if (skipLink) {
    skipLink.after(banner);
  } else {
    document.body.prepend(banner);
  }

  return {
    banner,
    acceptBtn: banner.querySelector("#gdpr-accept"),
    declineBtn: banner.querySelector("#gdpr-decline"),
  };
}

/**
 * Hand keyboard focus to the page's main content
 * @function focusMain
 * @description The control that held focus vanishes with the banner or the dialog, and focus would fall back to the top of the document. <main> takes it without joining the tab order; reset.css draws no ring around it.
 * @returns {void}
 */
function focusMain() {
  const main = document.querySelector("main");
  if (!main) {
    return;
  }
  if (!main.hasAttribute("tabindex")) {
    main.setAttribute("tabindex", "-1");
  }
  main.focus({ preventScroll: true });
}

/**
 * Keep --gdpr-banner-height equal to the banner's height while it is shown
 * @function trackBannerHeight
 * @description gdpr.css turns the height into scroll padding, so focus is never scrolled under the banner. A ResizeObserver follows the wrapping text across widths; a hidden banner measures 0, which clears the padding.
 * @param {HTMLElement} banner - The consent banner
 * @returns {void}
 */
function trackBannerHeight(banner) {
  const root = document.documentElement;
  const update = () =>
    root.style.setProperty("--gdpr-banner-height", `${banner.offsetHeight}px`);
  if ("ResizeObserver" in globalThis) {
    new ResizeObserver(update).observe(banner);
  }
  update();
}

/**
 * Confirm a refusal was recorded and say what it costs
 * @function showRefusalNotice
 * @description A native modal dialog: showModal() moves focus to the OK button, keeps it inside, makes the page behind inert and closes on Escape, none of which an aria-modal div does by itself. Every way out ends in the close event, which removes the notice, so repeated refusals cannot stack dialogs. The mailto route stays on screen because a refusal must not become a dead end for reaching the author. The dialog has no padding of its own, so a click whose target is the dialog itself landed on the backdrop: only those dismiss it.
 * @returns {void}
 */
function showRefusalNotice() {
  document.getElementById("gdpr-refusal-notice")?.remove();

  const notice = document.createElement("dialog");
  notice.id = "gdpr-refusal-notice";
  notice.className = "gdpr-refusal-notice";
  notice.setAttribute("aria-labelledby", "gdpr-refusal-title");

  notice.innerHTML = `
    <div class="gdpr-refusal-notice-card">
      <h4 id="gdpr-refusal-title">Sending disabled</h4>
      <p>
        You declined consent for third-party services. The contact form is now disabled.
        You can still reach me directly at
        <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.
      </p>
      <div class="gdpr-refusal-notice-actions">
        <button type="button" class="btn" id="gdpr-refusal-close" autofocus>OK</button>
      </div>
    </div>
  `;

  notice.addEventListener("close", () => {
    notice.remove();
    focusMain();
  });
  notice.addEventListener("click", (event) => {
    if (event.target === notice) {
      notice.close();
    }
  });
  notice
    .querySelector("#gdpr-refusal-close")
    ?.addEventListener("click", () => notice.close());

  document.body.appendChild(notice);
  notice.showModal();
}

/**
 * Broadcast a consent decision to the rest of the application
 * @function notifyConsentChange
 * @description Announcing by event keeps this module from importing the contact form: whoever cares subscribes to gdpr:consent-changed on globalThis. The event is fire-and-forget, so a listener registered afterwards misses it — stored consent, not this event, is the source of truth at init time.
 * @param {string} status - The recorded decision, "accepted" or "declined"
 * @returns {void}
 */
function notifyConsentChange(status) {
  globalThis.dispatchEvent(
    new CustomEvent("gdpr:consent-changed", {
      detail: { status },
    })
  );
}

/**
 * Show the consent banner and bind the two decisions it offers
 * @function initGDPRBanner
 * @description The banner appears only when no choice was ever recorded, so a decision is asked once and not on every visit. What a decision changes is the contact form's business: it reads the stored choice at init and listens for gdpr:consent-changed afterwards. Each decision is written under both gdpr-consent and the legacy gdpr-choice key, as privacy-policy.html states. Any [data-gdpr-reopen] control on the page re-opens the banner, because withdrawing consent has to be as easy as giving it.
 * @returns {void}
 */
export function initGDPRBanner() {
  /* The site no longer measures usage. A visitor who accepted while it did
     still holds that buffer: erased here, not left behind in the browser. */
  if (readStored("analytics_events") !== null) {
    removeStored("analytics_events");
  }

  const { banner, acceptBtn, declineBtn } = buildBanner();

  if (!getConsentStatus()) {
    banner.classList.remove("hidden");
  }

  /**
   * Record a decision, put the banner away and announce it
   * @function decide
   * @param {string} status - "accepted" or "declined"
   * @returns {void}
   */
  function decide(status) {
    writeStored("gdpr-consent", status);
    writeStored("gdpr-choice", status);
    banner.classList.add("hidden");
    notifyConsentChange(status);
  }

  /**
   * Put the decision back in the visitor's hands
   * @function handleReopen
   * @description Erases the record instead of flipping it: re-showing the banner
   * with a decision still stored would leave the page acting on the old answer
   * until a new button is pressed.
   * @returns {void}
   */
  function handleReopen() {
    removeStored("gdpr-consent");
    removeStored("gdpr-choice");
    banner.classList.remove("hidden");
  }

  trackBannerHeight(banner);

  acceptBtn?.addEventListener("click", () => {
    decide("accepted");
    focusMain();
  });
  declineBtn?.addEventListener("click", () => {
    decide("declined");
    showRefusalNotice();
  });

  document.querySelectorAll("[data-gdpr-reopen]").forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();
      handleReopen();
    });
  });
}
