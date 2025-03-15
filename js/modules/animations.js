/**
 * Module pour les animations
 */

/**
 * Initialise les animations d'apparition au défilement
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
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".fade-in, .slide-left, .slide-right")
    .forEach((element) => {
      observer.observe(element);
    });
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
      typeSpeed = 1000; // Pause before deleting
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // Pause before typing new word
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 1000);
}
