/**
 * Contact form, sent through EmailJS
 * @module ContactForm
 */

import { EMAILJS } from "../utils/config.js";
import { getConsentStatus } from "../utils/gdpr.js";
import { captchaToken, loadCaptcha, resetCaptcha } from "./captcha.js";

/**
 * Wire the contact form, or replace it with a mailto notice after a refusal
 * @function initContactForm
 * @returns {void}
 */
export function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.querySelector(".form-status");

  if (!contactForm) {
    return;
  }

  if (getConsentStatus() === "declined") {
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
      showStatus(formStatus, "", "");
    }
  });

  /* The first field a visitor enters, once the banner is accepted, loads the
     checkbox: by the time the message is written it is there. */
  const captchaBox = contactForm.querySelector(".form-captcha");
  contactForm.addEventListener("focusin", () => {
    if (captchaBox && getConsentStatus() === "accepted") {
      loadCaptcha(captchaBox).catch((error) => console.warn(error));
    }
  });

  setupFormSubmissionHandling(contactForm, formStatus, captchaBox);
}

/**
 * Swap the form's fields for a mailto link, so a refusal is never a dead end
 * @function renderContactAlternative
 * @param {HTMLElement} form - Form element
 * @returns {void}
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
 * Write the form's status line, the one place that does
 * @function showStatus
 * @description The state class alone draws the line: forms.css gives .form-status its box only with a state, so an empty state leaves an empty, boxless live region and no gap in the form layout. Messages are this module's own constants, some carrying a mailto link, never visitor input.
 * @param {HTMLElement} statusElement - Status container; a missing element makes this a no-op
 * @param {string} state - "success", "error", "sending" or "info"; empty to hide the line
 * @param {string} message - Markup to display
 * @returns {void}
 */
function showStatus(statusElement, state, message) {
  if (!statusElement) {
    return;
  }

  statusElement.innerHTML = message;
  statusElement.className = state ? `form-status ${state}` : "form-status";
}

/**
 * Gate each submission on consent, validation and the reCAPTCHA, then hand it to EmailJS
 * @function setupFormSubmissionHandling
 * @description A submission the trap marks as automated still gets the usual success and no send, before any CAPTCHA is asked: the script learns nothing to adapt to.
 * @param {HTMLElement} form - Form element
 * @param {HTMLElement} statusElement - Status display element
 * @param {HTMLElement} captchaBox - Container of the reCAPTCHA checkbox
 * @returns {void}
 */
function setupFormSubmissionHandling(form, statusElement, captchaBox) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    /* No recorded choice is not a refusal: a refusal replaces the form
       outright, an unanswered banner only blocks this one submission. */
    if (getConsentStatus() !== "accepted") {
      showStatus(
        statusElement,
        "info",
        "Please choose Accept or Decline in the privacy banner before sending a message."
      );
      return;
    }

    const formData = new FormData(form);
    const validationError = validateContactFormData(formData);
    if (validationError) {
      showStatus(statusElement, "error", validationError);
      return;
    }

    if (form.classList.contains("sending")) {
      return;
    }

    const automated = isAutomatedSubmission(formData);
    const token = automated
      ? ""
      : await requireCaptcha(captchaBox, statusElement);
    if (token === null) {
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
      if (!automated) {
        await sendMessage(formData, token);
      }

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
      setFormState(
        form,
        submitButton,
        statusElement,
        "error",
        `Sending error. Please contact me directly at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>`
      );
    } finally {
      resetCaptcha();
      setTimeout(() => {
        form.classList.remove("sending");
        if (submitButton) {
          submitButton.removeAttribute("aria-disabled");
        }
      }, 3000);
    }
  });
}

/**
 * Return the ticked reCAPTCHA's token, or say what is missing
 * @function requireCaptcha
 * @description A box not yet drawn is loaded here too, for a visitor who reached the button without entering a field. When Google's script cannot load at all, blocked by an extension or a network, the mailto route is offered rather than a dead end.
 * @param {HTMLElement} container - Container of the reCAPTCHA checkbox
 * @param {HTMLElement} statusElement - Status display element
 * @returns {Promise<string|null>} The token, or null once the visitor has been told what to do
 */
async function requireCaptcha(container, statusElement) {
  const token = captchaToken();
  if (token) {
    return token;
  }

  try {
    await loadCaptcha(container);
  } catch (error) {
    console.warn(error);
    showStatus(
      statusElement,
      "error",
      'The anti-spam check could not load. Please contact me directly at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.'
    );
    return null;
  }

  showStatus(
    statusElement,
    "info",
    "Please tick “I'm not a robot” above the button, then send your message."
  );
  return null;
}

/**
 * Read a form field as trimmed text
 * @function readTextField
 * @description FormData.get returns File | string | null, and a File stringifies
 * to "[object Object]" — a truthy value that would sail through validation. Only
 * strings are accepted, so a file input under this name yields an empty field
 * rather than a fake one.
 * @param {FormData} formData - Submitted form values
 * @param {string} name - Field name
 * @returns {string} Trimmed value, or an empty string when the field holds no text
 */
function readTextField(formData, name) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Check the submitted fields before spending an EmailJS round-trip
 * @function validateContactFormData
 * @description Returns the message to display rather than a boolean, so the empty string is the success case. The email pattern is deliberately loose: it rejects obvious typos without pretending to validate deliverability.
 * @param {FormData} formData - Submitted form values
 * @returns {string} Message to display, or an empty string when the data is valid
 */
function validateContactFormData(formData) {
  const name = readTextField(formData, "name");
  const email = readTextField(formData, "email");
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
 * Tell a scripted submission apart from a person's
 * @function isAutomatedSubmission
 * @description Two signals no visitor produces: navigator.webdriver, which a browser under automation reports unless the script switches it off, and the off-screen trap field, which nobody can see or tab into. A positive result is answered with the usual success and no send, so the script gets no error to adapt to. This filters the page, not the key: a script that calls the EmailJS API directly with the public identifiers never runs this code.
 * @param {FormData} formData - Submitted form values
 * @returns {boolean} True when the submission comes from a script
 */
function isAutomatedSubmission(formData) {
  return (
    navigator.webdriver === true || readTextField(formData, "website") !== ""
  );
}

/**
 * Send the validated message through the EmailJS REST API
 * @function sendMessage
 * @description A plain fetch to the endpoint EmailJS's own SDK calls, with the body it sends. The SDK is not used: it read localStorage while loading, so a browser that blocks site data broke it before any message could leave. The keys of template_params are the live EmailJS template's contract, not this form's, which is why the name and the address each go out twice. Rename or drop one only together with the template.
 * @param {FormData} formData - Submitted form values, already validated
 * @param {string} token - Solved reCAPTCHA token, which EmailJS verifies with Google before sending
 * @returns {Promise<void>} Resolves once EmailJS has accepted the message; rejects with its status and reply otherwise
 */
async function sendMessage(formData, token) {
  const senderName = readTextField(formData, "name");
  const senderEmail = readTextField(formData, "email");

  const response = await fetch(EMAILJS.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS.service,
      template_id: EMAILJS.template,
      user_id: EMAILJS.user,
      template_params: {
        from_name: senderName,
        user_name: senderName,
        email: senderEmail,
        user_email: senderEmail,
        message: readTextField(formData, "message"),
        to_name: "Christophe",
        "g-recaptcha-response": token,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `EmailJS answered ${response.status}: ${await response.text()}`
    );
  }
}

/**
 * Lock the form and show a status; only the submit handler's finally unlocks it
 * @function setFormState
 * @description The lock is the form's sending class, which the submit handler checks first. The button only says it is locked, through aria-disabled: the disabled property would also drop the keyboard focus it holds, back to the top of the page.
 * @param {HTMLElement} form - Form element
 * @param {HTMLElement} button - Submit button
 * @param {HTMLElement} statusElement - Status element
 * @param {string} state - "success", "error", "sending" or "info"
 * @param {string} message - Markup to display
 * @returns {void}
 */
function setFormState(form, button, statusElement, state, message) {
  form.classList.add("sending");
  if (button) {
    button.setAttribute("aria-disabled", "true");
  }

  showStatus(statusElement, state, message);
}
