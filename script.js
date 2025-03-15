/*
 * Ce fichier crée des conflits avec l'architecture modulaire.
 * Toutes ses fonctionnalités ont été migrées vers les modules dans /js/modules/.
 * Il est préférable de ne pas l'inclure pour éviter les comportements imprévisibles.
 */

// Code désactivé pour éviter les conflits
/*
document.addEventListener("DOMContentLoaded", () => {
    // code désactivé...
});
*/

// Gestion du GDPR
document.addEventListener("DOMContentLoaded", function () {
  const gdprBanner = document.getElementById("gdpr-banner");
  const acceptButton = document.getElementById("gdpr-accept");
  const declineButton = document.getElementById("gdpr-decline");
  const contactForm = document.getElementById("contactForm");

  // Vérifier si l'utilisateur a déjà fait un choix
  const gdprChoice = localStorage.getItem("gdpr-choice");

  // Masquer la bannière si un choix a déjà été fait
  if (gdprChoice) {
    if (gdprBanner) gdprBanner.style.display = "none";
  } else {
    // Montrer la bannière seulement si aucun choix n'a été fait
    if (gdprBanner) gdprBanner.style.display = "block";
  }

  // Gestion des événements de clic sur les boutons si les éléments existent
  if (acceptButton) {
    acceptButton.addEventListener("click", function () {
      localStorage.setItem("gdpr-choice", "accepted");
      if (gdprBanner) gdprBanner.style.display = "none";
      // Aucune action supplémentaire nécessaire car le formulaire est activé par défaut
    });
  }

  if (declineButton) {
    declineButton.addEventListener("click", function () {
      localStorage.setItem("gdpr-choice", "declined");
      if (gdprBanner) gdprBanner.style.display = "none";
      // Désactiver le formulaire si l'utilisateur décline
      if (contactForm) {
        contactForm.innerHTML =
          '<p class="gdpr-message">The contact form has been disabled because you declined our privacy policy. You can contact me directly by email at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.</p>';
      }
    });
  }

  // Appliquer l'état du formulaire au chargement selon le choix GDPR
  if (gdprChoice === "declined" && contactForm) {
    contactForm.innerHTML =
      '<p class="gdpr-message">The contact form has been disabled because you declined our privacy policy. You can contact me directly by email at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.</p>';
  }
});
