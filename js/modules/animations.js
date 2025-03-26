/**
 * Module pour gérer les animations du site
 */
export function initAnimations() {
  // Configuration IntersectionObserver partagée
  const createObserver = (callback, options = {}) => {
    return new IntersectionObserver(
      callback,
      Object.assign(
        {
          root: null,
          threshold: 0.1,
          // Ajouter une marge pour éviter l'effet yoyo au scroll
          rootMargin: "-10% 0px -10% 0px",
        },
        options
      )
    );
  };

  // Observer principal pour animations standard
  const observer = createObserver((entries, observer) => {
    entries.forEach((entry) => {
      // Seulement ajouter/supprimer la classe au franchissement complet du seuil
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");

        // Option: Arrêter d'observer pour éviter l'effet yoyo pendant scroll rapide
        if (
          entry.target.classList.contains("project-card") ||
          entry.target.closest("#projects")
        ) {
          observer.unobserve(entry.target);
        }
      }
    });
  });

  // Observer spécifique pour les titres de sections - MODIFIÉ
  const sectionHeaderObserver = createObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        // Seulement ajouter la classe title-animate, ne jamais la retirer
        // pour éviter l'effet yoyo sur les titres de sections
        if (entry.isIntersecting) {
          entry.target.classList.add("title-animate");

          // Arrêter d'observer après la première animation pour éviter l'effet yoyo
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "-10% 0px" }
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

  // Animation des titres de sections spécifiques (Skills, Projects) - Ciblage précis
  const sectionHeaders = document.querySelectorAll(
    "#skills .section-header h2, #projects .section-header h2"
  );
  sectionHeaders.forEach((header) => sectionHeaderObserver.observe(header));

  // Comportement spécifique pour la page projets
  if (document.querySelector(".project-navigation")) {
    document.querySelectorAll(".project.description").forEach((card) => {
      card.classList.add("fade-in");
    });
  }

  // Gestion spécifique de la page portfolio-details
  if (document.querySelector(".portfolio-details")) {
    handlePortfolioDetailsAnimations();
  }

  /**
   * Configure les animations pour la page portfolio-details
   */
  function handlePortfolioDetailsAnimations() {
    const portfolioSections = document.querySelectorAll(".portfolio-section");

    const portfolioObserver = createObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear", "section-active");

            // Animation séquentielle des éléments enfants
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

    // Animer la section CTA si présente
    const ctaSection = document.querySelector(".cta-section");
    if (ctaSection) {
      createObserver(
        (entries) =>
          entries[0].isIntersecting &&
          entries[0].target.classList.add("appear"),
        { threshold: 0.5 }
      ).observe(ctaSection);
    }
  }

  /**
   * Anime les éléments enfants avec un délai progressif
   * @param {Element} parent - Élément parent
   * @param {string} selector - Sélecteur pour les enfants
   * @param {string} className - Classe à ajouter
   */
  function animateChildElements(parent, selector, className) {
    const elements = parent.querySelectorAll(selector);
    elements.forEach((item, index) => {
      setTimeout(() => item.classList.add(className), 100 * index);
    });
  }
}

/**
 * Effet machine à écrire
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
