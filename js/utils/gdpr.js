/**
 * Module pour la gestion du consentement GDPR
 */
export function initGDPRBanner() {
  const gdprBanner = document.getElementById("gdpr-banner");
  const acceptBtn = document.getElementById("gdpr-accept");
  const declineBtn = document.getElementById("gdpr-decline");

  // Vérifier si l'utilisateur a déjà fait un choix
  const gdprChoice = localStorage.getItem("gdpr-choice");

  if (!gdprChoice) {
    // Afficher la bannière si aucun choix n'a été fait
    if (gdprBanner) {
      gdprBanner.style.display = "block";
    }
  }

  // Gérer l'acceptation
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("gdpr-choice", "accepted");
      if (gdprBanner) {
        gdprBanner.style.display = "none";
      }
    });
  }

  // Gérer le refus
  if (declineBtn) {
    declineBtn.addEventListener("click", () => {
      localStorage.setItem("gdpr-choice", "declined");
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
