/**
 * Contact form module with EmailJS integration
 * @module ContactForm
 */
export function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.querySelector(".form-status");

  if (!contactForm) {
    return;
  }

  const gdprChoice =
    localStorage.getItem("gdpr-consent") || localStorage.getItem("gdpr-choice");
  if (gdprChoice === "declined") {
    renderContactAlternative(contactForm);
    return;
  }

  globalThis.addEventListener("gdpr:consent-changed", (event) => {
    const status = event?.detail?.status;
    if (status === "declined") {
      renderContactAlternative(contactForm);
      return;
    }

    if (status === "accepted") {
      clearStatusMessage(formStatus);
    }
  });

  setupFormSubmissionHandling(contactForm, formStatus);
}

/**
 * Display alternative when GDPR is declined
 * @param {HTMLElement} form - Form element
 */
function renderContactAlternative(form) {
  const formContainer = form.closest(".contact-form");
  if (formContainer) {
    formContainer.style.opacity = "1";
    formContainer.style.pointerEvents = "auto";
  }

  form.innerHTML = `
    <p class="gdpr-message">
      The contact form has been disabled because you declined our privacy policy.
      You can contact me directly by email at
      <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.
    </p>`;
}

/**
 * Tell the visitor to answer the privacy banner before sending
 * @function showConsentRequiredNotice
 * @description Covers the case where no choice was ever recorded, which is distinct from a recorded refusal: refusal replaces the form outright, an unanswered banner only blocks this one submission and is styled as info rather than an error.
 * @param {HTMLElement} statusElement - Status container; a missing element makes this a no-op
 * @returns {void}
 */
function showConsentRequiredNotice(statusElement) {
  if (!statusElement) {
    return;
  }

  statusElement.innerHTML =
    "Please choose Accept or Decline in the privacy banner before sending a message.";
  statusElement.className = "form-status info";
  statusElement.style.display = "block";
}

/**
 * Retract the status message and collapse its container
 * @function clearStatusMessage
 * @description Called when consent flips to accepted, to drop a notice that has just become false. Display is reset to none rather than only emptying the text, so the collapsed container leaves no gap in the form layout.
 * @param {HTMLElement} statusElement - Status container; a missing element makes this a no-op
 * @returns {void}
 */
function clearStatusMessage(statusElement) {
  if (!statusElement) {
    return;
  }

  statusElement.innerHTML = "";
  statusElement.className = "form-status";
  statusElement.style.display = "none";
}

/**
 * Configure form submission handling
 * @param {HTMLElement} form - Form element
 * @param {HTMLElement} statusElement - Status display element
 */
function setupFormSubmissionHandling(form, statusElement) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const gdprChoice =
      localStorage.getItem("gdpr-consent") ||
      localStorage.getItem("gdpr-choice");

    if (gdprChoice !== "accepted") {
      showConsentRequiredNotice(statusElement);
      return;
    }

    const formData = new FormData(form);
    const validationError = validateContactFormData(formData);
    if (validationError) {
      if (statusElement) {
        statusElement.innerHTML = validationError;
        statusElement.className = "form-status error";
        statusElement.style.display = "block";
      }
      return;
    }

    if (form.classList.contains("sending")) {
      return;
    }

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

      await emailjs.send(serviceId, templateId, templateParams);

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
      setTimeout(() => {
        form.classList.remove("sending");
        if (submitButton) {
          submitButton.disabled = false;
        }
      }, 3000);
    }
  });
}

/**
 * Read the first of several field names that carries a text value
 * @function readTextField
 * @description FormData.get returns File | string | null, and a File stringifies
 * to "[object Object]" — a truthy value that would sail through validation. Only
 * strings are accepted, so a file input under one of these names yields an empty
 * field rather than a fake one. Several names per field because the markup and
 * the EmailJS template disagree on them.
 * @param {FormData} formData - Submitted form values
 * @param {...string} names - Field names to try, in order of preference
 * @returns {string} Trimmed value of the first text field found, or an empty string
 */
function readTextField(formData, ...names) {
  for (const name of names) {
    const value = formData.get(name);
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

/**
 * Check the submitted fields before spending an EmailJS round-trip
 * @function validateContactFormData
 * @description Returns the message to display rather than a boolean, so the empty string is the success case. The email pattern is deliberately loose: it rejects obvious typos without pretending to validate deliverability.
 * @param {FormData} formData - Submitted form values
 * @returns {string} Message to display, or an empty string when the data is valid
 */
function validateContactFormData(formData) {
  const name = readTextField(formData, "name", "from_name");
  const email = readTextField(formData, "email", "user_email");
  const message = readTextField(formData, "message");

  if (!name || !email || !message) {
    return "Please fill in your name, email address, and message before sending.";
  }

  /* The final class excludes the dot so only the last one can be the separator.
     Letting both sides match dots makes the engine retry every dot in the
     address, and accepted a trailing dot ("a@b.co.") as valid. */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }

  if (message.length < 10) {
    return "Please write a slightly longer message (at least 10 characters).";
  }

  return "";
}

/**
 * Resolve the EmailJS credentials to use for this form
 * @function getEmailConfig
 * @description globalThis.runtimeConfig outranks the data-emailjs-* attributes, so a deployment can override the markup without touching it. Today loadRuntimeConfig() returns hardcoded values and no page carries those attributes, so the dataset branch is a fallback for a case that does not exist yet — kept because EmailJS identifiers are public by design and may well move into the markup. Every field falls back to an empty string rather than undefined, letting callers gate on truthiness alone.
 * @param {HTMLElement} form - Form carrying the data-emailjs-* fallback attributes
 * @returns {{user: string, service: string, template: string}} Resolved EmailJS identifiers
 */
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
  if (button) {
    button.disabled = true;
  }

  if (statusElement) {
    statusElement.innerHTML = message;
    statusElement.className = `form-status ${state}`;
    statusElement.style.display = "block";
  }
}
