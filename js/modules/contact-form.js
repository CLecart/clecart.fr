/**
 * Contact form module with validation and submission
 * @module ContactForm
 * @description Handles form submission, validation and user feedback
 */

/**
 * Initialize contact form functionality
 * @function initContactForm
 * @description Sets up form validation, submission and error handling
 * @returns {void}
 */
export function initContactForm() {
  const form = document.getElementById("contact-form");
  const statusDiv = document.querySelector(".form-status");

  /**
   * DOM elements selection for form handling
   */
  if (!form || !statusDiv) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    const formData = new FormData(form);

    const data = {
      name: sanitizeInput(formData.get("name")),
      email: sanitizeInput(formData.get("email")),
      message: sanitizeInput(formData.get("message")),
    };

    if (!validateForm(data)) {
      showStatus("error", "Please fill in all fields correctly.");
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      showStatus("sending", "Sending your message...");

      const response = await fetch("https://formspree.io/f/xdkogwqb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showStatus("success", "Message sent successfully! I'll get back to you soon.");
        form.reset();

        const inputs = form.querySelectorAll("input, textarea");
        inputs.forEach((input) => {
          input.classList.remove("has-content", "email-valid");
        });

        if (window.analytics) {
          window.analytics.trackEvent("Contact", "FormSubmit", "Success");
        }
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      showStatus("error", "Failed to send message. Please try again later.");
      
      if (window.analytics) {
        window.analytics.trackEvent("Contact", "FormSubmit", "Error");
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });

  /**
   * Form validation function
   * @param {Object} data - Form data to validate
   * @returns {boolean} Validation result
   */
  function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      data.name.trim().length >= 2 &&
      emailRegex.test(data.email) &&
      data.message.trim().length >= 10
    );
  }

  /**
   * Input sanitization function
   * @param {string} input - Input string to sanitize
   * @returns {string} Sanitized string
   * @description Escapes dangerous HTML characters for security
   */
  function sanitizeInput(input) {
    if (!input) return "";
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  /**
   * Status display function
   * @param {string} type - Status type (success, error, sending)
   * @param {string} message - Status message to display
   */
  function showStatus(type, message) {
    statusDiv.className = `form-status ${type}`;
    statusDiv.textContent = message;

    setTimeout(() => {
      if (type !== "success") {
        statusDiv.className = "form-status";
        statusDiv.textContent = "";
      }
    }, 5000);
  }
}
