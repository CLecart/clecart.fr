// gdpr.js
// Module utilitaire pour la gestion de la bannière et du consentement RGPD

/**
 * Initialise la bannière RGPD et gère le consentement utilisateur
 */
export function initGDPRBanner() {
  // Sélection de la bannière et des boutons d'action
  const gdprBanner = document.getElementById("gdpr-banner");
  const acceptBtn = document.getElementById("gdpr-accept");
  const declineBtn = document.getElementById("gdpr-decline");

  // Vérifier si l'utilisateur a déjà fait un choix
  const gdprChoice = localStorage.getItem("gdpr-choice");

  // Affichage de la bannière si nécessaire
  if (!gdprChoice) {
    // Afficher la bannière si aucun choix n'a été fait
    if (gdprBanner) {
      gdprBanner.style.display = "block";
    }
  }

  // Gestion du consentement (accept/refuse)
  // Gérer l'acceptation
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("gdpr-choice", "accepted");
      // Masquage de la bannière après choix
      if (gdprBanner) {
        gdprBanner.style.display = "none";
      }
    });
  }

  // Gérer le refus
  if (declineBtn) {
    declineBtn.addEventListener("click", () => {
      localStorage.setItem("gdpr-choice", "declined");
      // Masquage de la bannière après choix
      if (gdprBanner) {
        gdprBanner.style.display = "none";
      }

      // Désactiver le formulaire de contact si présent
      const contactForm = document.getElementById("contactForm");
      if (contactForm) {
        contactForm.innerHTML =
          '<p class="gdpr-message">The contact form has been disabled because you declined our privacy policy. You can contact me directly by email at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.</p>';
      }
    });
  }
}
