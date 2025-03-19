/**
 * Module pour les animations - Optimisé
 */
export function initAnimations() {
  // Configuration uniforme de l'observateur
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  // Création d'un seul observer partagé
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Gestion adaptative: apparition/disparition conditionnelle
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");
      } else {
        // Détecter si l'élément est sorti complètement vers le haut
        // pour permettre la réanimation lors du défilement vers le haut
        const boundingRect = entry.boundingClientRect;
        if (boundingRect.top + boundingRect.height < 0) {
          entry.target.classList.remove("appear");
        }
      }
    });
  }, observerOptions);

  // Sélection ciblée des éléments à animer
  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-left, .slide-right, .project.description.card-base"
  );

  // Application uniforme de l'observation
  animatedElements.forEach((element) => observer.observe(element));

  // Traitement spécialisé pour la page de projets
  if (document.querySelector(".project-navigation")) {
    const projectCards = document.querySelectorAll(".project.description");
    projectCards.forEach((card) => card.classList.add("fade-in"));
  }
}

/**
 * Initialise l'effet machine à écrire
 */
export function initTypewriter() {
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
