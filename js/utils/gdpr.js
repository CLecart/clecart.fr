/**
 * GDPR compliance module for privacy management
 * @module GDPR
 * @description Handles user consent for analytics and form functionality
 */

/**
 * Initialize GDPR banner with user consent management
 * @function initGDPRBanner
 * @description Shows banner only if no previous choice was made
 * @returns {void}
 */
function getConsentStatus() {
  const consent = localStorage.getItem("gdpr-consent");
  if (typeof consent === "string") return consent;

  const legacyChoice = localStorage.getItem("gdpr-choice");
  return typeof legacyChoice === "string" ? legacyChoice : null;
}

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

function notifyConsentChange(status) {
  globalThis.dispatchEvent(
    new CustomEvent("gdpr:consent-changed", {
      detail: { status },
    })
  );
}

export function initGDPRBanner() {
  const { banner, acceptBtn, declineBtn } = ensureBannerElements();

  if (!banner) return;

  /**
   * Conditional GDPR banner display
   * @description Shows only if no choice has been recorded
   */
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

    /**
     * Contact form deactivation after refusal
     */
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
