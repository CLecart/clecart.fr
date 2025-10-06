/**
 * @fileoverview Module de gestion de la conformité RGPD
 * @description Gère la bannière de consentement et les choix utilisateur selon le RGPD
 * @version 1.0.0
 * @author Christophe Lecart <djlike@hotmail.fr>
 */

/**
 * Initialise la bannière RGPD et configure la gestion du consentement
 * @function initGDPRBanner
 * @description Configure l'affichage de la bannière et les handlers de consentement RGPD
 * @returns {void}
 * @example
 * // Activer la gestion RGPD
 * initGDPRBanner();
 *
 * @see {@link https://gdpr.eu/} Règlement général sur la protection des données
 */
export function initGDPRBanner() {
  /**
   * Éléments DOM de la bannière RGPD
   * @type {HTMLElement|null}
   */
  const gdprBanner = document.getElementById("gdpr-banner");
  const acceptBtn = document.getElementById("gdpr-accept");
  const declineBtn = document.getElementById("gdpr-decline");

  /**
   * Vérification du choix utilisateur précédent
   * @type {string|null}
   * @description Récupère le consentement stocké localement ('accepted' | 'declined' | null)
   */
  const gdprChoice = localStorage.getItem("gdpr-choice");

  /**
   * Affichage conditionnel de la bannière RGPD
   * @description Affiche uniquement si aucun choix n'a été enregistré
   */
  if (!gdprChoice) {
    if (gdprBanner) {
      gdprBanner.style.display = "block";
    }
  }

  /**
   * Gestionnaire d'acceptation du consentement RGPD
   * @description Enregistre l'acceptation et masque la bannière
   */
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("gdpr-choice", "accepted");
      if (gdprBanner) {
        gdprBanner.style.display = "none";
      }
    });
  }

  /**
   * Gestionnaire de refus du consentement RGPD
   * @description Enregistre le refus, masque la bannière et désactive le formulaire
   */
  if (declineBtn) {
    declineBtn.addEventListener("click", () => {
      localStorage.setItem("gdpr-choice", "declined");
      if (gdprBanner) {
        gdprBanner.style.display = "none";
      }

      /**
       * Désactivation du formulaire de contact après refus
       * @description Remplace le formulaire par un message d'information
       */
      const contactForm = document.getElementById("contactForm");
      if (contactForm) {
        contactForm.innerHTML =
          '<p class="gdpr-message">The contact form has been disabled because you declined our privacy policy. You can contact me directly by email at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.</p>';
      }
    });
  }
}
