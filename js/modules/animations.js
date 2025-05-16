// animations.js
// Module dédié à la gestion des animations d'apparition et d'effets visuels sur le site

/**
 * Initialise les animations d'apparition sur les éléments observés
 */
export function initAnimations() {
  // Création d'observateurs pour déclencher les animations lors de l'entrée dans le viewport
  const createObserver = (callback, options = {}) => {
    return new IntersectionObserver(
      callback,
      Object.assign(
        {
          root: null,
          threshold: 0.1,
          rootMargin: "-10% 0px -10% 0px",
        },
        options
      )
    );
  };

  const observer = createObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");

        if (
          entry.target.classList.contains("project-card") ||
          entry.target.closest("#projects")
        ) {
          observer.unobserve(entry.target);
        }
      }
    });
  });

  // Observer pour les titres de section
  const sectionHeaderObserver = createObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("title-animate");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "-10% 0px" }
  );

  // Observer pour les sections entières (effet d'activation)
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

  // Application des observateurs sur les éléments cibles
  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-left, .slide-right, .project.description.card-base"
  );
  animatedElements.forEach((element) => observer.observe(element));

  const sectionHeaders = document.querySelectorAll(
    "#skills .section-header h2, #projects .section-header h2"
  );
  sectionHeaders.forEach((header) => sectionHeaderObserver.observe(header));

  if (document.querySelector(".project-navigation")) {
    document.querySelectorAll(".project.description").forEach((card) => {
      card.classList.add("fade-in");
    });
  }

  if (document.querySelector(".portfolio-details")) {
    handlePortfolioDetailsAnimations();
  }

  // Gestion spécifique pour les pages de navigation projet et portfolio
  function handlePortfolioDetailsAnimations() {
    // Animation des sections de détails du portfolio
    const portfolioSections = document.querySelectorAll(".portfolio-section");

    const portfolioObserver = createObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear", "section-active");

            animateChildElements(
              entry.target,
              ".outcomes-list li",
              "appear-outcome"
            );
          }
        });
      },
      { threshold: 0.15, rootMargin: "-10% 0px" }
    );

    portfolioSections.forEach((section) => portfolioObserver.observe(section));

    const ctaSection = document.querySelector(".cta-section");
    if (ctaSection) {
      createObserver(
        (entries) =>
          entries[0].isIntersecting &&
          entries[0].target.classList.add("appear"),
        { threshold: 0.5 }
      ).observe(ctaSection);
    }

    function animateChildElements(parent, selector, className) {
      // Animation séquentielle des enfants d'un parent
      const elements = parent.querySelectorAll(selector);
      elements.forEach((item, index) => {
        setTimeout(() => item.classList.add(className), 100 * index);
      });
    }
  }
}

/**
 * Effet machine à écrire sur l'élément #typewriter
 */
export function initTypewriterEffect() {
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
