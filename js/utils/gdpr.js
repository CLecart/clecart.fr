/**
 * GDPR compliance module for privacy management
 * @module GDPR
 * @description Handles user consent for analytics and form functionality
 */

/**
 * Read back the consent decision recorded for this visitor
 * @function getConsentStatus
 * @description Falls back to the legacy gdpr-choice key so a decision taken before the rename is still honoured instead of re-prompting someone who already answered. Returns null rather than an empty string when nothing was recorded, letting the caller tell "never asked" apart from an explicit decision.
 * @returns {string|null} The recorded decision, or null when the visitor has not answered
 */
function getConsentStatus() {
  const consent = localStorage.getItem("gdpr-consent");
  if (typeof consent === "string") {
    return consent;
  }

  const legacyChoice = localStorage.getItem("gdpr-choice");
  return typeof legacyChoice === "string" ? legacyChoice : null;
}

/**
 * Get the consent banner, building it when the page ships without one
 * @function ensureBannerElements
 * @description Injecting the banner rather than requiring it in every page's markup means consent cannot be lost by a page that simply forgot the element. Button lookups accept the legacy accept-btn and decline-btn ids alongside the current ones, keeping older pages wired.
 * @returns {{banner: HTMLElement, acceptBtn: HTMLElement, declineBtn: HTMLElement}} The banner and its two action buttons
 */
function ensureBannerElements() {
  let banner = document.getElementById("gdpr-banner");

  if (!banner) {
    banner = document.createElement("div");
    banner.id = "gdpr-banner";
    banner.className = "gdpr-banner hidden";
    banner.innerHTML = `
      <div class="gdpr-content">
        <p>
          This site uses third-party services to process the contact form. By
          continuing, you accept our
          <a href="privacy-policy.html">privacy policy</a>.
        </p>
        <div class="gdpr-buttons">
          <button id="gdpr-accept" class="btn">Accept</button>
          <button id="gdpr-decline" class="btn btn-secondary">Decline</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
  }

  return {
    banner,
    acceptBtn:
      document.getElementById("gdpr-accept") ||
      document.getElementById("accept-btn"),
    declineBtn:
      document.getElementById("gdpr-decline") ||
      document.getElementById("decline-btn"),
  };
}

/**
 * Confirm a refusal was recorded and say what it costs
 * @function showRefusalNotice
 * @description Any previous notice is removed first, so repeated refusals cannot stack dialogs. The mailto route stays on screen because a refusal must not become a dead end for reaching the author. Only clicks landing on the backdrop itself dismiss it: the target comparison keeps a click inside the card from closing the dialog under the visitor.
 * @returns {void}
 */
function showRefusalNotice() {
  const existingNotice = document.getElementById("gdpr-refusal-notice");
  if (existingNotice) {
    existingNotice.remove();
  }

  const notice = document.createElement("div");
  notice.id = "gdpr-refusal-notice";
  notice.className = "gdpr-refusal-notice";
  notice.setAttribute("role", "dialog");
  notice.setAttribute("aria-modal", "true");
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
        <button type="button" class="btn" id="gdpr-refusal-close">OK</button>
      </div>
    </div>
  `;

  /**
   * Dismiss the refusal notice
   * @function closeNotice
   * @description Detaches the notice from the DOM rather than hiding it; the next refusal rebuilds one from scratch.
   * @returns {void}
   */
  function closeNotice() {
    notice.remove();
  }

  notice.addEventListener("click", (event) => {
    if (event.target === notice) {
      closeNotice();
    }
  });

  const closeButton = notice.querySelector("#gdpr-refusal-close");
  closeButton?.addEventListener("click", closeNotice);

  document.body.appendChild(notice);
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
 * @description The banner appears only when no choice was ever recorded, so a decision is asked once and not on every visit. A stored refusal is re-applied on each load, disabling the contact inputs before any interaction rather than trusting the form to check. Each decision is written to both gdpr-consent and the legacy gdpr-choice key, keeping the two readers of that state in agreement during the migration.
 * @returns {void}
 */
export function initGDPRBanner() {
  const { banner, acceptBtn, declineBtn } = ensureBannerElements();

  if (!banner) {
    return;
  }

  const storedConsentStatus = getConsentStatus();
  const consentStatus =
    typeof storedConsentStatus === "string" ? storedConsentStatus : "";
  if (consentStatus === "") {
    banner.classList.remove("hidden");
  }

  /**
   * Handle consent acceptance
   * @function handleAccept
   * @description Records acceptance and hides banner
   */
  function handleAccept() {
    localStorage.setItem("gdpr-consent", "accepted");
    localStorage.setItem("gdpr-choice", "accepted");
    banner.classList.add("hidden");
    notifyConsentChange("accepted");
    globalThis.analytics?.enableTracking();
  }

  /**
   * Handle consent decline
   * @function handleDecline
   * @description Records refusal, hides banner and disables form
   */
  function handleDecline() {
    localStorage.setItem("gdpr-consent", "declined");
    localStorage.setItem("gdpr-choice", "declined");
    banner.classList.add("hidden");
    notifyConsentChange("declined");
    globalThis.analytics?.disableTracking();
    showRefusalNotice();

    const contactForm = document.querySelector("#contact-form");
    if (contactForm) {
      const inputs = contactForm.querySelectorAll("input, textarea, button");
      inputs.forEach((input) => {
        input.disabled = true;
      });
    }
  }

  acceptBtn?.addEventListener("click", handleAccept);
  declineBtn?.addEventListener("click", handleDecline);

  if (consentStatus === "declined") {
    const contactForm = document.querySelector("#contact-form");
    if (contactForm) {
      const inputs = contactForm.querySelectorAll("input, textarea, button");
      inputs.forEach((input) => {
        input.disabled = true;
      });
    }
  }
}
