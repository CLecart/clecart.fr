/**
 * Module pour le formulaire de contact avec EmailJS
 */
export function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("form-status");

  if (!contactForm) return;

  // Vérification du consentement GDPR et adaptation de l'interface
  const gdprChoice = localStorage.getItem("gdpr-choice");
  if (gdprChoice === "declined") {
    renderContactAlternative(contactForm);
    return;
  }

  // Configuration du comportement du formulaire
  setupFormSubmissionHandling(contactForm, formStatus);
}

/**
 * Affiche une alternative au formulaire quand le GDPR est refusé
 */
function renderContactAlternative(form) {
  form.innerHTML = `
    <p class="gdpr-message">
      Le formulaire de contact a été désactivé car vous avez refusé notre politique de confidentialité. 
      Vous pouvez me contacter directement par email à 
      <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.
    </p>`;
}

/**
 * Configure la gestion de soumission du formulaire
 */
function setupFormSubmissionHandling(form, statusElement) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Éviter les soumissions multiples
    if (form.classList.contains("sending")) return;

    // UI feedback immédiat
    const submitButton = form.querySelector('button[type="submit"]');
    setFormState(
      form,
      submitButton,
      statusElement,
      "sending",
      "Envoi de votre message..."
    );

    try {
      // Récupération des données dans un format adapté à EmailJS
      const formData = new FormData(form);
      const templateParams = {
        from_name: formData.get("from_name"),
        user_name: formData.get("from_name"),
        email: formData.get("email"),
        user_email: formData.get("email"),
        message: formData.get("message"),
        to_name: "Christophe",
      };

      // Vérification que le service EmailJS est disponible
      if (typeof emailjs === "undefined") {
        throw new Error("Service d'email non disponible");
      }

      // Envoi du message
      await emailjs.send("service_lokewrs", "template_2ov9l9i", templateParams);

      // Succès
      setFormState(
        form,
        submitButton,
        statusElement,
        "success",
        "Message envoyé avec succès!"
      );
      form.reset();
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      setFormState(
        form,
        submitButton,
        statusElement,
        "error",
        `Erreur d'envoi. Merci de me contacter directement à <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>`
      );
    } finally {
      // Réinitialisation du formulaire après délai
      setTimeout(() => {
        form.classList.remove("sending");
        if (submitButton) submitButton.disabled = false;
      }, 3000);
    }
  });
}

/**
 * Met à jour l'état visuel du formulaire
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
