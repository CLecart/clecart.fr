/**
 * Module pour le formulaire de contact avec EmailJS
 */
export function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("form-status");

  if (!contactForm) return;

  // Nettoyer les styles inline des éléments du formulaire
  contactForm
    .querySelectorAll("input, textarea, label, .form-group")
    .forEach((el) => {
      el.removeAttribute("style");
      el.classList.remove("form-control");
    });

  // Vérifier le consentement GDPR
  const gdprChoice = localStorage.getItem("gdpr-choice");
  if (gdprChoice === "declined") {
    contactForm.innerHTML =
      '<p class="gdpr-message">The contact form has been disabled because you declined our privacy policy. You can contact me directly by email at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.</p>';
    return;
  }

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (contactForm.classList.contains("sending")) {
      return;
    }

    contactForm.classList.add("sending");
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    if (formStatus) {
      formStatus.textContent = "Sending your message...";
      formStatus.className = "form-status sending";
      formStatus.style.display = "block";
    }

    const formData = new FormData(contactForm);
    const templateParams = {
      from_name: formData.get("from_name"),
      email: formData.get("email"),
      message: formData.get("message"),
      to_name: "Christophe",
    };

    if (typeof emailjs !== "undefined") {
      emailjs
        .send("service_lokewrs", "template_2ov9l9i", templateParams)
        .then(function () {
          if (formStatus) {
            formStatus.textContent = "Message sent successfully!";
            formStatus.className = "form-status success";
          }
          contactForm.reset();
        })
        .catch(function () {
          if (formStatus) {
            formStatus.innerHTML =
              'Error sending message. Please email me directly at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>';
            formStatus.className = "form-status error";
          }
        })
        .finally(function () {
          setTimeout(() => {
            contactForm.classList.remove("sending");
            if (submitBtn) submitBtn.disabled = false;
          }, 3000);
        });
    } else {
      if (formStatus) {
        formStatus.innerHTML =
          'Email service not available. Please contact me directly at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>';
        formStatus.className = "form-status error";
      }

      setTimeout(() => {
        contactForm.classList.remove("sending");
        if (submitBtn) submitBtn.disabled = false;
      }, 3000);
    }
  });
}
