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
export function initGDPRBanner() {
  const banner = document.getElementById("gdpr-banner");
  const acceptBtn = document.getElementById("accept-btn");
  const declineBtn = document.getElementById("decline-btn");

  if (!banner) return;

  /**
   * Check for previous user consent choice
   * @function getConsentStatus
   * @description Retrieves locally stored consent ('accepted' | 'declined' | null)
   * @returns {string|null} User consent status
   */
  function getConsentStatus() {
    return localStorage.getItem("gdpr-consent");
  }

  /**
   * Conditional GDPR banner display
   * @description Shows only if no choice has been recorded
   */
  const consentStatus = getConsentStatus();
  if (consentStatus === null) {
    banner.classList.remove("hidden");
  }

  /**
   * Handle consent acceptance
   * @function handleAccept
   * @description Records acceptance and hides banner
   */
  function handleAccept() {
    localStorage.setItem("gdpr-consent", "accepted");
    banner.classList.add("hidden");
    if (window.analytics) {
      window.analytics.enableTracking();
    }
  }

  /**
   * Handle consent decline
   * @function handleDecline
   * @description Records refusal, hides banner and disables form
   */
  function handleDecline() {
    localStorage.setItem("gdpr-consent", "declined");
    banner.classList.add("hidden");
    if (window.analytics) {
      window.analytics.disableTracking();
    }

    /**
     * Contact form deactivation after refusal
     */
    const contactForm = document.querySelector("#contact-form");
    if (contactForm) {
      const inputs = contactForm.querySelectorAll("input, textarea, button");
      inputs.forEach((input) => {
        input.disabled = true;
      });

      const formContainer = contactForm.closest(".contact-form");
      if (formContainer) {
        formContainer.style.opacity = "0.5";
        formContainer.style.pointerEvents = "none";
      }
    }
  }

  if (acceptBtn && declineBtn) {
    acceptBtn.addEventListener("click", handleAccept);
    declineBtn.addEventListener("click", handleDecline);
  }

  if (consentStatus === "declined") {
    const contactForm = document.querySelector("#contact-form");
    if (contactForm) {
      const inputs = contactForm.querySelectorAll("input, textarea, button");
      inputs.forEach((input) => {
        input.disabled = true;
      });

      const formContainer = contactForm.closest(".contact-form");
      if (formContainer) {
        formContainer.style.opacity = "0.5";
        formContainer.style.pointerEvents = "none";
      }
    }
  }
}
