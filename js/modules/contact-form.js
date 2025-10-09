/**
 * Contact form module with EmailJS integration
 * @module ContactForm
 */
export function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.querySelector(".form-status");

  if (!contactForm) return;

  // Check GDPR consent and adapt interface
  const gdprChoice = localStorage.getItem("gdpr-choice");
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
      // Get data in EmailJS format
      const formData = new FormData(form);
      const templateParams = {
        from_name: formData.get("from_name"),
        user_name: formData.get("from_name"),
        email: formData.get("email"),
        user_email: formData.get("email"),
        message: formData.get("message"),
        to_name: "Christophe",
      };

      // Check EmailJS service availability
      if (typeof emailjs === "undefined") {
        throw new Error("Email service unavailable");
      }

      // Send message
      await emailjs.send("service_lokewrs", "template_2ov9l9i", templateParams);

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
      setFormState(
        form,
        submitButton,
        statusElement,
        "error",
        `Sending error. Please contact me directly at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>`
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
