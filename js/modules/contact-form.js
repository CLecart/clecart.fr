// contact-form.js
// Module de gestion du formulaire de contact et de l'envoi des messages

/**
 * Initialise la gestion du formulaire de contact
 */
export function initContactForm() {
  // Sélection du formulaire et des éléments de statut
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("form-status");

  if (!contactForm) return;

  // Gestion de la soumission du formulaire
  const gdprChoice = localStorage.getItem("gdpr-choice");
  if (gdprChoice === "declined") {
    renderContactAlternative(contactForm);
    return;
  }

  // Affichage des messages de statut (succès, erreur, envoi)
  setupFormSubmissionHandling(contactForm, formStatus);
  // Réinitialisation du formulaire après envoi
}

/**
 * Affiche une alternative au formulaire de contact si la politique de confidentialité est refusée
 * @param {HTMLElement} form - Élément du formulaire de contact
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
 * Configure la gestion de la soumission du formulaire
 * @param {HTMLFormElement} form - Élément du formulaire de contact
 * @param {HTMLElement} statusElement - Élément d'affichage du statut
 */
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

/**
 * Met à jour l'état du formulaire et affiche un message de statut
 * @param {HTMLFormElement} form - Élément du formulaire de contact
 * @param {HTMLButtonElement} button - Bouton de soumission du formulaire
 * @param {HTMLElement} statusElement - Élément d'affichage du statut
 * @param {string} state - État du formulaire (sending, success, error)
 * @param {string} message - Message à afficher
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
