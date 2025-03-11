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

  // Improve hamburger menu functionality
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("nav ul");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");

      // Ensure menu takes the right color based on mode
      const isDarkMode = document.body.classList.contains("dark-mode");
      if (isDarkMode) {
        navMenu.classList.add("dark-mode");
      } else {
        navMenu.classList.remove("dark-mode");
      }
    });
  }

  // Close mobile menu when a link is clicked
  document.querySelectorAll("nav ul li a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navMenu.classList.remove("active");
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 768 &&
      navMenu.classList.contains("active") &&
      !e.target.closest("nav") &&
      !e.target.closest(".nav-toggle")
    ) {
      navMenu.classList.remove("active");
    }
  });

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

  // Code simplifié pour le dark mode toggle
  const darkModeToggle = document.querySelector(".dark-mode-toggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      // Mettre à jour l'icône
      const isDarkMode = document.body.classList.contains("dark-mode");
      darkModeToggle.innerHTML = isDarkMode
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';

      // Sauvegarder la préférence
      localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");

      // Fix section title colors after dark mode toggle
      fixSectionTitles();
    });

    // Initialiser selon la préférence stockée
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }

  // Function to fix section title colors in dark mode - section-titles-fix.js
  function fixSectionTitles() {
    if (document.body.classList.contains("dark-mode")) {
      // Select all section headers
      document.querySelectorAll(".section-header h2").forEach((title) => {
        title.style.color = "var(--primary)";
      });

      // Specifically target Skills section header
      const skillsHeader = document.querySelector("#skills .section-header h2");
      if (skillsHeader) {
        skillsHeader.style.color = "var(--primary)";
      }
    }
  }

  // Run when page loads
  fixSectionTitles();

  // Implement more robust email handling with fallback
  function setupContactForm() {
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("form-status");

    if (!contactForm) return;

    // Check if EmailJS is available and set status message
    const emailJsAvailable = typeof window.emailjs !== "undefined";
    const directEmailMsg = document.getElementById("direct-email-msg");

    // Show appropriate message based on EmailJS availability
    if (directEmailMsg) {
      if (emailJsAvailable) {
        directEmailMsg.style.display = "none";
      } else {
        directEmailMsg.style.display = "block";
        console.warn("EmailJS not available, showing direct email message");
      }
    }

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Show sending status
      if (formStatus) {
        formStatus.textContent = "Sending your message...";
        formStatus.className = "form-status sending";
        formStatus.style.display = "block";
      }

      // If EmailJS is available, attempt to send email
      if (emailJsAvailable) {
        emailjs
          .sendForm("service_lokewrs", "template_2ov9l9i", contactForm)
          .then(function (response) {
            console.log("SUCCESS", response);
            formStatus.textContent = "Message sent successfully!";
            formStatus.className = "form-status success";
            contactForm.reset();
          })
          .catch(function (error) {
            console.error("FAILED", error);
            formStatus.innerHTML = `Message could not be sent. Please email me directly at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>`;
            formStatus.className = "form-status error";
          });
      } else {
        // Fallback if EmailJS is not available
        console.error("EmailJS not loaded");
        const formData = new FormData(contactForm);
        const name = formData.get("from_name") || "Not provided";
        const email = formData.get("email") || "Not provided";
        const message = formData.get("message") || "No message content";

        // Open user's email client as fallback
        const mailtoLink = `mailto:djlike@hotmail.fr?subject=Contact from ${name}&body=From: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;

        window.open(mailtoLink);

        formStatus.innerHTML = `The email form is currently unavailable. Your default email client should have opened. If not, please email me directly at <a href="mailto:djlike@hotmail.fr">djlike@hotmail.fr</a>`;
        formStatus.className = "form-status error";
      }
    });
  }

  // Run the contact form setup
  setupContactForm();

  // Image Viewer functionality (merged from imageviewer.js)
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
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
