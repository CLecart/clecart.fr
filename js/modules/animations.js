/**
 * Entrance animations and the typewriter
 * @module Animations
 */

/**
 * Create an IntersectionObserver that ignores the bottom tenth of the viewport
 * @function createObserver
 * @param {Function} callback - Callback function for observed entries
 * @returns {IntersectionObserver} Configured observer instance
 */
function createObserver(callback) {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: [0, 0.1, 0.5, 1],
  });
}

/**
 * Reveal entrance-animated elements as they scroll in, and flag the sections on screen
 * @function initAnimations
 * @returns {void}
 */
export function initAnimations() {
  const animationObserver = createObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");

        if (entry.target.classList.contains("project-card")) {
          animationObserver.unobserve(entry.target);
        }
      }
    });
  });

  document
    .querySelectorAll(".fade-in, .slide-left, .slide-right")
    .forEach((element) => {
      animationObserver.observe(element);
    });

  const sectionObserver = createObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("section-active", entry.isIntersecting);
    });
  });

  document.querySelectorAll("section[id]").forEach((section) => {
    sectionObserver.observe(section);
  });

  initLearningOutcomesAnimations();
}

/**
 * Reveal the learning-outcome items 100 ms apart, the first time the list scrolls in
 * @function initLearningOutcomesAnimations
 * @returns {void}
 */
function initLearningOutcomesAnimations() {
  const outcomesList = document.querySelector(".outcomes-list");
  if (!outcomesList) {
    return;
  }

  const outcomesObserver = createObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const listItems = entry.target.querySelectorAll("li");

        listItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add("appear-outcome");
          }, index * 100);
        });

        outcomesObserver.unobserve(entry.target);
      }
    });
  });

  outcomesObserver.observe(outcomesList);
}

/**
 * Cycle the hero subtitle through the role titles, typing and deleting each
 * @function initTypewriterEffect
 * @returns {void}
 */
export function initTypewriterEffect() {
  const typewriterElement = document.querySelector(".typewriter-text");
  if (!typewriterElement) {
    return;
  }

  const texts = [
    "Software Engineer",
    "Green IT Lead",
    "Go Developer",
    "Sustainable Architectures",
  ];

  /* setTimeout-driven, so the CSS reduced-motion query cannot reach it. */
  if (globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typewriterElement.textContent = texts[0];
    return;
  }

  let currentTextIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseDuration = 2000;

  /**
   * Type or delete a single character, then schedule the next step
   * @function typeEffect
   * @description Re-schedules itself through setTimeout rather than running on a fixed interval, so typing, deleting and the end-of-word pause can each use their own delay. The early return on that pause is what keeps a second timer from racing the one at the bottom.
   * @returns {void}
   */
  function typeEffect() {
    const currentText = texts[currentTextIndex];

    if (!isDeleting) {
      typewriterElement.textContent = currentText.substring(
        0,
        currentCharIndex + 1
      );
      currentCharIndex++;

      if (currentCharIndex === currentText.length) {
        setTimeout(() => {
          isDeleting = true;
          typeEffect();
        }, pauseDuration);
        return;
      }
    } else {
      typewriterElement.textContent = currentText.substring(
        0,
        currentCharIndex - 1
      );
      currentCharIndex--;

      if (currentCharIndex === 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % texts.length;
      }
    }

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(typeEffect, speed);
  }

  typeEffect();
}
