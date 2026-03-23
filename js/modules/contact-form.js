/**
 * Contact form module with EmailJS integration
 * @module ContactForm
 */
export function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.querySelector(".form-status");

  if (!contactForm) return;

  // Check GDPR consent and adapt interface
  const gdprChoice =
    localStorage.getItem("gdpr-consent") || localStorage.getItem("gdpr-choice");
  if (gdprChoice === "declined") {
    renderContactAlternative(contactForm);
    return;
  }

  // Configure form behavior
  setupFormSubmissionHandling(contactForm, formStatus);
}

/**
 * Display alternative when GDPR is declined
 * @param {HTMLElement} form - Form element
 */
function renderContactAlternative(form) {
  form.innerHTML = `
    <p class="gdpr-message">
      The contact form has been disabled because you declined our privacy policy.
      You can contact me directly by email at
      <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.
    </p>`;
}

/**
 * Configure form submission handling
 * @param {HTMLElement} form - Form element
 * @param {HTMLElement} statusElement - Status display element
 */
function setupFormSubmissionHandling(form, statusElement) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Prevent multiple submissions
    if (form.classList.contains("sending")) return;

    // Immediate UI feedback
    const submitButton = form.querySelector('button[type="submit"]');
    setFormState(
      form,
      submitButton,
      statusElement,
      "sending",
      "Sending your message..."
    );

    try {
      const emailCfg = getEmailConfig(form);
      const serviceId = emailCfg.service || "service_lokewrs";
      const templateId = emailCfg.template || "template_2ov9l9i";

      // Get data in EmailJS format
      const formData = new FormData(form);
      const senderName =
        formData.get("from_name") || formData.get("name") || "Anonymous";
      const senderEmail =
        formData.get("email") || formData.get("user_email") || "";
      const templateParams = {
        from_name: senderName,
        user_name: senderName,
        email: senderEmail,
        user_email: senderEmail,
        message: formData.get("message"),
        to_name: "Christophe",
      };

      // Check EmailJS service availability
      if (typeof emailjs === "undefined") {
        setFormState(
          form,
          submitButton,
          statusElement,
          "error",
          'Email service unavailable right now. Please contact me at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.'
        );
        return;
      }

      if (!emailCfg.user || !serviceId || !templateId) {
        setFormState(
          form,
          submitButton,
          statusElement,
          "error",
          'Contact form is temporarily unavailable. Please contact me at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.'
        );
        return;
      }

      if (emailCfg.user) {
        emailjs.init(emailCfg.user);
      }

      // Send message
      await emailjs.send(serviceId, templateId, templateParams);

      // Success
      setFormState(
        form,
        submitButton,
        statusElement,
        "success",
        "Message sent successfully!"
      );
      form.reset();
    } catch (error) {
      console.error("Sending error:", error);
      const errorMessage =
        error?.message ||
        "Sending failed. Please contact me directly by email.";
      const isConfigError = errorMessage.includes("not configured");

      setFormState(
        form,
        submitButton,
        statusElement,
        "error",
        isConfigError
          ? `Contact form is temporarily unavailable (EmailJS configuration missing). Please contact me directly at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.`
          : `Sending error. Please contact me directly at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>`
      );
    } finally {
      // Reset form after delay
      setTimeout(() => {
        form.classList.remove("sending");
        if (submitButton) submitButton.disabled = false;
      }, 3000);
    }
  });
}

function getEmailConfig(form) {
  const runtimeCfg = globalThis.runtimeConfig?.emailjs || {};
  const datasetCfg = {
    user: form?.dataset?.emailjsUser || "",
    service: form?.dataset?.emailjsService || "",
    template: form?.dataset?.emailjsTemplate || "",
  };

  return {
    user: runtimeCfg.user || datasetCfg.user || "",
    service: runtimeCfg.service || datasetCfg.service || "",
    template: runtimeCfg.template || datasetCfg.template || "",
  };
}

/**
 * Update form visual state
 * @param {HTMLElement} form - Form element
 * @param {HTMLElement} button - Submit button
 * @param {HTMLElement} statusElement - Status element
 * @param {string} state - State name
 * @param {string} message - Status message
 */
function setFormState(form, button, statusElement, state, message) {
  form.classList.add("sending");
  if (button) button.disabled = true;

  if (statusElement) {
    statusElement.innerHTML = message;
    statusElement.className = `form-status ${state}`;
    statusElement.style.display = "block";
  }
}
