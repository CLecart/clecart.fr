/**
 * Module pour les animations
 */
export function initAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");
      } else {
        entry.target.classList.remove("appear");
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-left, .slide-right, .project.description.card-base"
  );

  animatedElements.forEach((element) => observer.observe(element));

  // Initialisation du typewriter intégré ici plutôt que dans un fichier séparé
  initTypewriterEffect();

  if (document.querySelector(".project-navigation")) {
    const projectCards = document.querySelectorAll(".project.description");
    projectCards.forEach((card) => card.classList.add("fade-in"));
  }
}

/**
 * Effet machine à écrire intégré
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
