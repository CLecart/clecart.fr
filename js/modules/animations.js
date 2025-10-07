/**
 * Animation module with intersection observer and scroll effects
 * @module Animations
 * @description Handles element animations, scroll detection and typewriter effects
 */

let lastScrollY = 0;
let scrollDirection = "down";

/**
 * Intersection observer factory for configurable observers
 * @function createObserver
 * @param {function} callback - Callback function for observed entries
 * @param {object} options - Custom options for observer
 * @returns {IntersectionObserver} Configured observer instance
 * @description Simplifies observer creation with optimal default options
 */
function createObserver(callback, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: [0, 0.1, 0.5, 1],
  };

  const mergedOptions = { ...defaultOptions, ...options };
  return new IntersectionObserver(callback, mergedOptions);
}

/**
 * Initialize scroll-triggered animations for elements
 * @function initAnimations
 * @description Triggers 'appear' class when intersecting with viewport
 */
export function initAnimations() {
  const elementsToAnimate = document.querySelectorAll(
    ".project-card, .skill-card, .language-card, .section-intro, .about-intro"
  );

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

  elementsToAnimate.forEach((element) => {
    animationObserver.observe(element);
  });

  const allAnimatedElements = document.querySelectorAll(
    ".fade-in, .slide-left, .slide-right"
  );
  allAnimatedElements.forEach((element) => {
    if (!element.classList.contains("appear")) {
      animationObserver.observe(element);
    }
  });

  /**
   * Specialized observer for section headers
   */
  const sectionHeaders = document.querySelectorAll("h2, .section-title");
  const headerObserver = createObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("appear");
        }
      });
    },
    { rootMargin: "0px 0px -20% 0px" }
  );

  sectionHeaders.forEach((header) => {
    headerObserver.observe(header);
  });

  /**
   * Section activation observer with direction detection
   * @description Manages active section state and scroll direction
   */
  const sections = document.querySelectorAll("section[id]");
  const sectionObserver = createObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        /**
         * Scroll direction detection
         */
        const currentScrollY = window.scrollY;
        scrollDirection = currentScrollY > lastScrollY ? "down" : "up";
        lastScrollY = currentScrollY;

        entry.target.classList.add("section-active");

        if (scrollDirection === "down") {
          entry.target.setAttribute("data-scroll-direction", "down");
        } else {
          entry.target.setAttribute("data-scroll-direction", "up");
        }
      } else {
        entry.target.classList.remove("section-active");
      }
    });
  });

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  const currentPath = window.location.pathname;
  if (
    currentPath.includes("descriptions-projects") ||
    currentPath.includes("project")
  ) {
    initProjectPageAnimations();
  }

  // Initialize Learning Outcomes animations for about-portfolio page
  if (currentPath.includes("about-portfolio")) {
    initLearningOutcomesAnimations();
  }
}

/**
 * Initialize specialized animations for project pages
 * @function initProjectPageAnimations
 * @description Configures specialized animations for portfolio sections
 */
function initProjectPageAnimations() {
  const projectElements = document.querySelectorAll(
    ".project-showcase, .project-details, .tech-stack"
  );

  const projectObserver = createObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");
        projectObserver.unobserve(entry.target);
      }
    });
  });

  projectElements.forEach((element) => {
    projectObserver.observe(element);
  });
}

/**
 * Initialize animations for Learning Outcomes cards
 * @function initLearningOutcomesAnimations
 * @description Animates outcomes list items with staggered appear-outcome class
 */
function initLearningOutcomesAnimations() {
  const outcomesList = document.querySelector(".outcomes-list");
  if (!outcomesList) return;

  const outcomesObserver = createObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const listItems = entry.target.querySelectorAll("li");

        // Animate each list item with staggered timing
        listItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add("appear-outcome");
          }, index * 100); // 100ms delay between each item
        });

        outcomesObserver.unobserve(entry.target);
      }
    });
  });

  outcomesObserver.observe(outcomesList);
}

/**
 * Initialize typewriter effect for dynamic text
 * @function initTypewriterEffect
 * @returns {void}
 */
export function initTypewriterEffect() {
  const typewriterElement = document.querySelector(".typewriter-text");
  if (!typewriterElement) return;

  const texts = [
    "Web & Mobile Developer",
    "JavaScript Specialist",
    "Go Developer",
    "Modern App Creator",
  ];

  let currentTextIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseDuration = 2000;

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
