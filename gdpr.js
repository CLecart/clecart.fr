document.addEventListener("DOMContentLoaded", function () {
  const gdprBanner = document.getElementById("gdpr-banner");
  const acceptButton = document.getElementById("gdpr-accept");
  const declineButton = document.getElementById("gdpr-decline");
  const contactForm = document.getElementById("contactForm");

  // Vérifier si l'utilisateur a déjà fait un choix
  const gdprChoice = localStorage.getItem("gdpr-choice");

  if (!gdprChoice) {
    // Montrer la bannière si aucun choix n'a été fait
    gdprBanner.style.display = "block";
  }

  acceptButton.addEventListener("click", function () {
    localStorage.setItem("gdpr-choice", "accepted");
    gdprBanner.style.display = "none";
    // Activer le formulaire si nécessaire
  });

  declineButton.addEventListener("click", function () {
    localStorage.setItem("gdpr-choice", "declined");
    gdprBanner.style.display = "none";
    // Désactiver le formulaire si nécessaire
    if (contactForm) {
      contactForm.innerHTML =
        '<p>The contact form has been disabled because you declined our privacy policy. You can contact me directly by email at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.</p>';
    }
  });

  // Vérifier le choix au chargement pour le formulaire
  if (gdprChoice === "declined" && contactForm) {
    contactForm.innerHTML =
      '<p>The contact form has been disabled because you declined our privacy policy. You can contact me directly by email at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.</p>';
  }
});
