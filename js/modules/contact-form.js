export function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("form-status");

  if (!contactForm) return;

  const gdprChoice = localStorage.getItem("gdpr-choice");
  if (gdprChoice === "declined") {
    renderContactAlternative(contactForm);
    return;
  }

  setupFormSubmissionHandling(contactForm, formStatus);
}

function renderContactAlternative(form) {
  form.innerHTML = `
    <p class="gdpr-message">
      The contact form has been disabled because you declined our privacy policy. 
      You can contact me directly by email at 
      <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.
    </p>`;
}

function setupFormSubmissionHandling(form, statusElement) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (form.classList.contains("sending")) return;

    const sanitizeInput = (input) => {
      if (!input) return "";
      return input
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const submitButton = form.querySelector('button[type="submit"]');
    setFormState(
      form,
      submitButton,
      statusElement,
      "sending",
      "Sending your message..."
    );

    try {
      const formData = new FormData(form);
      const templateParams = {
        from_name: sanitizeInput(formData.get("from_name")),
        user_name: sanitizeInput(formData.get("from_name")),
        email: formData.get("email"),
        user_email: formData.get("email"),
        message: sanitizeInput(formData.get("message")),
        to_name: "Christophe",
      };

      if (typeof emailjs === "undefined") {
        throw new Error("Email service unavailable");
      }

      await emailjs.send("service_lokewrs", "template_2ov9l9i", templateParams);

      setFormState(
        form,
        submitButton,
        statusElement,
        "success",
        "Message sent successfully!"
      );
      form.reset();
    } catch (error) {
      setFormState(
        form,
        submitButton,
        statusElement,
        "error",
        `Sending error. Please contact me directly at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>`
      );
    } finally {
      setTimeout(() => {
        form.classList.remove("sending");
        if (submitButton) submitButton.disabled = false;
      }, 3000);
    }
  });
}

function setFormState(form, button, statusElement, state, message) {
  form.classList.add("sending");
  if (button) button.disabled = true;

  if (statusElement) {
    statusElement.innerHTML = message;
    statusElement.className = `form-status ${state}`;
    statusElement.style.display = "block";
  }
}
