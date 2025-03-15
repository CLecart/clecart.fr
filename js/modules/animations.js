/**
 * Module pour les animations
 * Inclut les effets d'apparition au scroll et l'effet machine à écrire
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

  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-left, .slide-right"
  );
  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // Les barres de compétences sont masquées via CSS, cette partie est désactivée
  // mais conservée en commentaire pour référence future
  /*
  const skillLevels = document.querySelectorAll(".skill-level");
  const skillObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const level = entry.target.dataset.level;
          entry.target.style.setProperty("--skill-level", `${level}%`);
          entry.target.style.transform = "scaleX(1)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillLevels.forEach((skill) => {
    skill.style.transform = "scaleX(0)";
    skill.style.transformOrigin = "left";
    skill.style.transition = "transform 1.5s ease";
    skillObserver.observe(skill);
  });
  */
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
