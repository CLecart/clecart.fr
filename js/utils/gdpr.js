/**
 * Module pour la gestion du consentement GDPR
 * Initialise la bannière et gère les choix de l'utilisateur
 */
export function initGDPRBanner() {
  const gdprBanner = document.getElementById("gdpr-banner");
  const acceptButton = document.getElementById("gdpr-accept");
  const declineButton = document.getElementById("gdpr-decline");
  const contactForm = document.getElementById("contactForm");
  const gdprChoice = localStorage.getItem("gdpr-choice");

  if (!gdprBanner) return;

  if (gdprChoice) {
    gdprBanner.style.display = "none";

    if (gdprChoice === "declined" && contactForm) {
      disableContactForm(contactForm);
    }
  } else {
    gdprBanner.style.display = "block";
  }

  if (acceptButton) {
    acceptButton.addEventListener("click", () => {
      localStorage.setItem("gdpr-choice", "accepted");
      gdprBanner.style.display = "none";
    });
  }

  if (declineButton) {
    declineButton.addEventListener("click", () => {
      localStorage.setItem("gdpr-choice", "declined");
      gdprBanner.style.display = "none";

      if (contactForm) {
        disableContactForm(contactForm);
      }
    });
  }
}

/**
 * Désactive le formulaire de contact et affiche un message alternatif
 */
function disableContactForm(form) {
  form.innerHTML =
    '<p class="gdpr-message">The contact form has been disabled because you declined our privacy policy. You can contact me directly by email at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.</p>';
}
