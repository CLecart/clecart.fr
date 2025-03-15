/**
 * Module pour gérer la bannière GDPR et les préférences utilisateur
 */

export function initGDPRBanner() {
  const gdprBanner = document.getElementById("gdpr-banner");
  const acceptButton = document.getElementById("gdpr-accept");
  const declineButton = document.getElementById("gdpr-decline");
  const contactForm = document.getElementById("contactForm");

  // Vérifier si l'utilisateur a déjà fait un choix
  const gdprChoice = localStorage.getItem("gdpr-choice");

  // Si un choix a déjà été fait, appliquer les conséquences
  if (gdprChoice) {
    if (gdprBanner) gdprBanner.style.display = "none";

    // Si l'utilisateur a refusé, désactiver le formulaire
    if (gdprChoice === "declined" && contactForm) {
      contactForm.innerHTML =
        '<p class="gdpr-message">The contact form has been disabled because you declined our privacy policy. You can contact me directly by email at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.</p>';
    }
  } else {
    // Montrer la bannière si aucun choix n'a été fait
    if (gdprBanner) gdprBanner.style.display = "block";
  }

  // Gestionnaire pour le bouton d'acceptation
  if (acceptButton) {
    acceptButton.addEventListener("click", function () {
      localStorage.setItem("gdpr-choice", "accepted");
      if (gdprBanner) gdprBanner.style.display = "none";
      // Aucune action supplémentaire nécessaire car le formulaire est déjà activé
    });
  }

  // Gestionnaire pour le bouton de refus
  if (declineButton) {
    declineButton.addEventListener("click", function () {
      localStorage.setItem("gdpr-choice", "declined");
      if (gdprBanner) gdprBanner.style.display = "none";

      // Afficher le message de refus et désactiver le formulaire
      if (contactForm) {
        contactForm.innerHTML =
          '<p class="gdpr-message">The contact form has been disabled because you declined our privacy policy. You can contact me directly by email at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.</p>';
      }
    });
  }
}
