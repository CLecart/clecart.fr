/**
 * Module pour gérer le formulaire de contact avec EmailJS
 */

export function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("form-status");

  if (!contactForm) return;

  // Vérifier si l'utilisateur a refusé le RGPD
  const gdprChoice = localStorage.getItem("gdpr-choice");
  if (gdprChoice === "declined") {
    contactForm.innerHTML =
      '<p class="gdpr-message">The contact form has been disabled because you declined our privacy policy. You can contact me directly by email at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.</p>';
    return;
  }

  // Gestionnaire pour la soumission du formulaire
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Vérifier si un envoi est déjà en cours
    if (contactForm.classList.contains("sending")) {
      return;
    }

    // Bloquer le formulaire pendant l'envoi
    contactForm.classList.add("sending");
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    // Afficher le statut "envoi en cours"
    if (formStatus) {
      formStatus.textContent = "Sending your message...";
      formStatus.className = "form-status sending";
      formStatus.style.display = "block";
    }

    // Préparation des données du formulaire
    const formData = new FormData(contactForm);
    const templateParams = {
      from_name: formData.get("from_name"),
      email: formData.get("email"),
      message: formData.get("message"),
      to_name: "Christophe",
    };

    // Envoi via EmailJS avec vérification de disponibilité
    if (typeof emailjs !== "undefined") {
      emailjs
        .send("service_lokewrs", "template_2ov9l9i", templateParams)
        .then(function (response) {
          if (formStatus) {
            formStatus.textContent = "Message sent successfully!";
            formStatus.className = "form-status success";
          }
          contactForm.reset();
        })
        .catch(function (error) {
          if (formStatus) {
            formStatus.innerHTML =
              'Error sending message. Please email me directly at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>';
            formStatus.className = "form-status error";
          }
        })
        .finally(function () {
          // Réactiver le formulaire après 3 secondes
          setTimeout(() => {
            contactForm.classList.remove("sending");
            if (submitBtn) submitBtn.disabled = false;
          }, 3000);
        });
    } else {
      // Fallback si EmailJS n'est pas disponible
      if (formStatus) {
        formStatus.innerHTML =
          'Email service not available. Please contact me directly at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>';
        formStatus.className = "form-status error";
      }

      // Réactiver le formulaire
      setTimeout(() => {
        contactForm.classList.remove("sending");
        if (submitBtn) submitBtn.disabled = false;
      }, 3000);
    }
  });
}
