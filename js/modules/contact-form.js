/**
 * @fileoverview Gestion du formulaire de contact avec EmailJS
 * @description Module de traitement des messages de contact avec respect RGPD et validation
 * @version 1.0.0
 * @author Christophe Lecart <djlike@hotmail.fr>
 */

/**
 * Initialise le système complet de gestion du formulaire de contact
 * @function initContactForm
 * @description Configure la soumission, validation et respect des préférences RGPD
 * @returns {void}
 * @example
 * // Activer le formulaire de contact
 * initContactForm();
 */
export function initContactForm() {
  /**
   * Sélection des éléments DOM nécessaires au formulaire
   * @description Récupère le formulaire et l'élément de statut pour la gestion
   */
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("form-status");

  if (!contactForm) return;

  /**
   * Vérification du consentement RGPD avant activation
   * @description Respect des préférences utilisateur pour la confidentialité
   */
  const gdprChoice = localStorage.getItem("gdpr-choice");
  if (gdprChoice === "declined") {
    renderContactAlternative(contactForm);
    return;
  }

  /**
   * Configuration de la gestion complète de soumission
   * @description Active tous les gestionnaires d'événements du formulaire
   */
  setupFormSubmissionHandling(contactForm, formStatus);
}

/**
 * Affiche une alternative de contact respectueuse du refus RGPD
 * @function renderContactAlternative
 * @param {HTMLElement} form - Élément du formulaire de contact à remplacer
 * @returns {void}
 * @description Remplace le formulaire par un message avec contact direct par email
 * @example
 * // Utilisé automatiquement si RGPD refusé
 * renderContactAlternative(contactForm);
 */
function renderContactAlternative(form) {
  /**
   * Remplacement du formulaire par un message explicatif
   * @description Fournit une alternative de contact respectueuse des préférences
   */
  form.innerHTML = `
    <p class="gdpr-message">
      The contact form has been disabled because you declined our privacy policy.
      You can contact me directly by email at
      <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.
    </p>`;
}

/**
 * Configure la gestion complète de soumission du formulaire avec EmailJS
 * @function setupFormSubmissionHandling
 * @param {HTMLFormElement} form - Élément du formulaire de contact
 * @param {HTMLElement} statusElement - Élément d'affichage du statut d'envoi
 * @returns {void}
 * @description Gère la soumission asynchrone avec validation, sanitation et feedback utilisateur
 * @example
 * // Configuration automatique lors de l'initialisation
 * setupFormSubmissionHandling(contactForm, formStatus);
 */
function setupFormSubmissionHandling(form, statusElement) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (form.classList.contains("sending")) return;

    /**
     * Fonction de sanitation des entrées utilisateur
     * @function sanitizeInput
     * @param {string} input - Texte à sanitiser
     * @returns {string} Texte sécurisé contre XSS
     * @description Échappe les caractères HTML dangereux pour la sécurité
     */
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
      /**
       * Préparation des données du formulaire pour EmailJS
       * @description Extraction et sanitation des champs de saisie
       */
      const formData = new FormData(form);
      const templateParams = {
        from_name: sanitizeInput(formData.get("from_name")),
        user_name: sanitizeInput(formData.get("from_name")),
        email: formData.get("email"),
        user_email: formData.get("email"),
        message: sanitizeInput(formData.get("message")),
        to_name: "Christophe",
      };

      /**
       * Vérification de la disponibilité du service EmailJS
       * @description Validation de la dépendance externe avant utilisation
       */
      if (typeof emailjs === "undefined") {
        throw new Error("Email service unavailable");
      }

      /**
       * Envoi du message via EmailJS avec configuration de service
       * @description Utilise les IDs de service et template configurés
       */
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
      /**
       * Gestion d'erreur avec fallback vers contact direct
       * @description Fournit une alternative en cas d'échec d'envoi
       */
      setFormState(
        form,
        submitButton,
        statusElement,
        "error",
        `Sending error. Please contact me directly at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>`
      );
    } finally {
      /**
       * Nettoyage de l'état du formulaire après traitement
       * @description Réactive le bouton et supprime l'état d'envoi après délai
       */
      setTimeout(() => {
        form.classList.remove("sending");
        if (submitButton) submitButton.disabled = false;
      }, 3000);
    }
  });
}

/**
 * Met à jour l'état visuel et fonctionnel du formulaire
 * @function setFormState
 * @param {HTMLFormElement} form - Élément du formulaire de contact
 * @param {HTMLButtonElement} button - Bouton de soumission du formulaire
 * @param {HTMLElement} statusElement - Élément d'affichage du statut
 * @param {string} state - État du formulaire ('sending', 'success', 'error')
 * @param {string} message - Message de statut à afficher à l'utilisateur
 * @returns {void}
 * @description Gère l'UI pendant les différentes phases de soumission du formulaire
 * @example
 * // Affichage de l'état d'envoi
 * setFormState(form, button, status, 'sending', 'Sending...');
 *
 * // Affichage du succès
 * setFormState(form, button, status, 'success', 'Message sent!');
 */
function setFormState(form, button, statusElement, state, message) {
  /**
   * Désactivation du formulaire pendant le traitement
   * @description Empêche les soumissions multiples accidentelles
   */
  form.classList.add("sending");
  if (button) button.disabled = true;

  /**
   * Mise à jour de l'affichage du statut avec styling approprié
   * @description Applique la classe CSS correspondant à l'état et affiche le message
   */
  if (statusElement) {
    statusElement.innerHTML = message;
    statusElement.className = `form-status ${state}`;
    statusElement.style.display = "block";
  }
}
