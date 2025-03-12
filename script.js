// Initialize animations and interactions
document.addEventListener("DOMContentLoaded", () => {
  // Header scroll effect
  const header = document.querySelector("header");
  const scrollThreshold = 100;

  window.addEventListener("scroll", () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Note: Menu hamburger géré par darkmode.js

  // Scroll animations
  const scrollElements = document.querySelectorAll(
    ".fade-in, .slide-left, .slide-right"
  );

  const elementInView = (el, percentageScroll = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <=
      (window.innerHeight || document.documentElement.clientHeight) *
        (percentageScroll / 100)
    );
  };

  const displayScrollElement = (element) => {
    element.classList.add("appear");
  };

  const hideScrollElement = (element) => {
    element.classList.remove("appear");
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 75)) {
        displayScrollElement(el);
      } else {
        hideScrollElement(el);
      }
    });
  };

  // Initialize scroll animation
  window.addEventListener("scroll", () => {
    handleScrollAnimation();
  });

  // Trigger once on load
  handleScrollAnimation();

  // Skill level animation
  const skillLevels = document.querySelectorAll(".skill-level");
  skillLevels.forEach((skill) => {
    const levelValue = skill.getAttribute("data-level") || "80";
    skill.style.setProperty("--level-width", `${levelValue}%`);
  });

  // Type writing effect
  const textElement = document.getElementById("typewriter");
  if (textElement) {
    const texts = ["Web Developer", "Mobile Developer", "Software Engineer"];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";

    (function type() {
      if (count === texts.length) {
        count = 0;
      }
      currentText = texts[count];
      letter = currentText.slice(0, ++index);

      textElement.textContent = letter;
      if (letter.length === currentText.length) {
        count++;
        index = 0;
        setTimeout(type, 2000);
      } else {
        setTimeout(type, 100);
      }
    })();
  }

  // Note: Le mode sombre est géré par darkmode.js

  // Refonte complète de la gestion du formulaire de contact pour éliminer les emails doubles
  function setupContactForm() {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    // Variable de verrouillage globale
    window.isProcessingEmail = false;

    // Vérifier si l'utilisateur a refusé le RGPD
    const gdprChoice = localStorage.getItem("gdpr-choice");
    if (gdprChoice === "declined") {
      contactForm.innerHTML =
        '<p class="gdpr-message">Le formulaire de contact est désactivé car vous avez refusé notre politique de confidentialité. Vous pouvez me contacter directement par email à <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>.</p>';
      return; // Arrêter l'exécution si RGPD refusé
    }

    // Un seul écouteur d'événement sur le formulaire
    contactForm.addEventListener("submit", handleFormSubmit);

    // Fonction spécifique pour gérer la soumission
    function handleFormSubmit(event) {
      event.preventDefault();

      const formStatus = document.getElementById("form-status");
      const submitButton = contactForm.querySelector('button[type="submit"]');

      // Vérification si un envoi est déjà en cours
      if (window.isProcessingEmail) {
        return;
      }

      // Verrouiller le formulaire
      window.isProcessingEmail = true;
      if (submitButton) submitButton.disabled = true;

      // Afficher le statut d'envoi
      if (formStatus) {
        formStatus.textContent = "Sending your message...";
        formStatus.className = "form-status sending";
        formStatus.style.display = "block";
      }

      // Vérifier si EmailJS est disponible
      const emailJsAvailable = typeof window.emailjs !== "undefined";

      if (emailJsAvailable) {
        // Utilisation d'une copie du formulaire pour éviter les problèmes
        const formData = new FormData(contactForm);
        const formObject = {};
        formData.forEach((value, key) => (formObject[key] = value));

        emailjs
          .send("service_lokewrs", "template_2ov9l9i", formObject)
          .then(function (response) {
            if (formStatus) {
              formStatus.textContent = "Message sent successfully!";
              formStatus.className = "form-status success";
            }
            contactForm.reset();
          })
          .catch(function (error) {
            if (formStatus) {
              formStatus.innerHTML = `Message could not be sent. Please email me directly at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>`;
              formStatus.className = "form-status error";
            }
          })
          .finally(function () {
            // Déverrouiller après 3 secondes pour éviter les doubles clics accidentels
            setTimeout(() => {
              window.isProcessingEmail = false;
              if (submitButton) submitButton.disabled = false;
            }, 3000);
          });
      } else {
        // Fallback pour ouvrir le client email
        const formData = new FormData(contactForm);
        const name = formData.get("from_name") || "Not provided";
        const email = formData.get("email") || "Not provided";
        const message = formData.get("message") || "No message";

        const mailtoLink = `mailto:djlike@hotmail.fr?subject=Contact from ${name}&body=From: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;
        window.open(mailtoLink);

        if (formStatus) {
          formStatus.innerHTML = `Opening your email client. If it doesn't open, please email me directly at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>`;
          formStatus.className = "form-status error";
        }

        // Déverrouiller après un délai
        setTimeout(() => {
          window.isProcessingEmail = false;
          if (submitButton) submitButton.disabled = false;
        }, 3000);
      }
    }
  }

  // Run the contact form setup
  setupContactForm();

  // Image Viewer functionality
  // Create modal for image viewing
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <span class="close">&times;</span>
    <img class="modal-content" id="expandedImg">
  `;
  document.body.appendChild(modal);

  const expandedImg = document.getElementById("expandedImg");
  const closeBtn = modal.querySelector(".close");

  // Add event listeners to project images
  document.querySelectorAll(".project-thumb img").forEach((img) => {
    img.addEventListener("click", function () {
      modal.style.display = "block";
      expandedImg.src = this.src;
    });
  });

  // Close modal when clicking X or outside the modal
  if (closeBtn) {
    closeBtn.onclick = function () {
      modal.style.display = "none";
    };
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});

// Gestion du GDPR
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
