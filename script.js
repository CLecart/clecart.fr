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

  // Amélioration de la gestion du menu mobile
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("nav ul");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");

      // Assurer que le menu prend la bonne couleur en fonction du mode
      const isDarkMode = document.body.classList.contains("dark-mode");
      if (isDarkMode) {
        navMenu.style.background = "var(--dark)";
      } else {
        navMenu.style.background = "white";
      }
    });
  }

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

  // Dark mode toggle
  const darkModeToggle = document.querySelector(".dark-mode-toggle");
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
    updateModeClasses();
    updateToggleIcon();

    // Store preference in local storage
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
  });

  const updateModeClasses = () => {
    const isDarkMode = document.body.classList.contains("dark-mode");
    const modeClass = isDarkMode ? "dark-mode" : "light-mode";

    // Apply mode class to sections and other major containers
    document
      .querySelectorAll("#skills, #about, #projects, #contact")
      .forEach((section) => {
        section.classList.remove("dark-mode", "light-mode");
        section.classList.add(modeClass);
      });

    // Apply mode class to individual elements - remove toggle-picture-btn from the list
    document
      .querySelectorAll(
        "header, nav ul li a, .btn, .btn-secondary, .section-header h2, .skill-card, .contact-info, .contact-form, .contact-icon, .contact-text h4, footer"
      )
      .forEach((el) => {
        el.classList.remove("dark-mode", "light-mode");
        el.classList.add(modeClass);
      });

    // Mettre à jour le style du menu mobile si ouvert
    const navMenu = document.querySelector("nav ul");
    if (navMenu && navMenu.classList.contains("active")) {
      const isDarkMode = document.body.classList.contains("dark-mode");
      navMenu.style.background = isDarkMode ? "var(--dark)" : "white";
    }
  };

  const updateToggleIcon = () => {
    const isDarkMode = document.body.classList.contains("dark-mode");
    const iconClass = isDarkMode ? "fas fa-sun" : "fas fa-moon";
    darkModeToggle.innerHTML = `<i class="${iconClass}"></i>`;
  };

  // Initialize mode based on user preference
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
  } else {
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
  }
  updateModeClasses();
  updateToggleIcon();

  // Initialize EmailJS
  emailjs.init("YOUR_USER_ID");

  // Handle form submission
  const contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const formObject = Object.fromEntries(formData.entries());

    emailjs
      .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", formObject)
      .then((response) => {
        alert("Message sent successfully!");
        contactForm.reset();
      })
      .catch((error) => {
        alert("Failed to send message. Please try again later.");
        console.error("EmailJS error:", error);
      });
  });

  // Remove the video toggle functionality - we'll keep the selector but make it a no-op
});
