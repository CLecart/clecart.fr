/**
 * Module pour les animations
 */
export function initAnimations() {
  // Configuration pour animations existantes
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  // Observateur principal pour animations existantes
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");
      } else {
        entry.target.classList.remove("appear");
      }
    });
  }, observerOptions);

  // Nouvel observateur pour titres de section avec effet spécial
  const sectionHeaderObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("title-animate");
        } else {
          entry.target.classList.remove("title-animate");
        }
      });
    },
    {
      root: null,
      rootMargin: "-10% 0px",
      threshold: 0.1,
    }
  );

  // Nouvel observateur pour sections complètes
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const direction = entry.boundingClientRect.y < 0 ? "up" : "down";

        if (entry.isIntersecting) {
          entry.target.classList.add("section-active");
          entry.target.setAttribute("data-scroll-direction", direction);
        } else {
          entry.target.classList.remove("section-active");
        }
      });
    },
    {
      root: null,
      rootMargin: "-20% 0px",
      threshold: 0.1,
    }
  );

  // Animation des éléments existants
  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-left, .slide-right, .project.description.card-base"
  );
  animatedElements.forEach((element) => observer.observe(element));

  // Animation des titres de sections spécifiques (Skills, Projects)
  const sectionHeaders = document.querySelectorAll(
    "#skills .section-header h2, #projects .section-header h2"
  );
  sectionHeaders.forEach((header) => sectionHeaderObserver.observe(header));

  // Animation au défilement pour toutes les sections
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => sectionObserver.observe(section));

  // Initialisation de l'effet machine à écrire
  initTypewriterEffect();

  // Comportement spécifique pour la page projets
  if (document.querySelector(".project-navigation")) {
    document.querySelectorAll(".project.description").forEach((card) => {
      card.classList.add("fade-in");
    });
  }

  // Animation spécifique pour la page portfolio-details
  if (document.querySelector(".portfolio-details")) {
    const portfolioSections = document.querySelectorAll(".portfolio-section");

    portfolioSections.forEach((section, index) => {
      // Ajouter un délai progressif pour une animation en cascade
      setTimeout(() => {
        section.classList.add("appear");
      }, 200 * index);

      // Animation au survol pour les éléments tech-item
      const techItems = section.querySelectorAll(".tech-item");
      techItems.forEach((item) => {
        item.addEventListener("mouseenter", () => {
          item.style.transition =
            "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
          item.style.transform = "translateY(-10px)";
        });

        item.addEventListener("mouseleave", () => {
          item.style.transform = "translateY(0)";
        });
      });
    });

    // Animation pour la liste des résultats d'apprentissage
    const outcomeItems = document.querySelectorAll(".outcomes-list li");
    outcomeItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add("appear-outcome");
      }, 100 * index);
    });
  }
}

/**
 * Effet machine à écrire
 */
function initTypewriterEffect() {
  const typewriterElement = document.getElementById("typewriter");
  if (!typewriterElement) return;

  const words = [
    "Web Developer",
    "Mobile Developer",
    "UI Designer",
    "Problem Solver",
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 1000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 1000);
}
