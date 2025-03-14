/**
 * Module pour gérer les animations
 */
export function initAnimations() {
  // Animation basée sur le défilement
  const elements = document.querySelectorAll('.fade-in, .slide-left, .slide-right');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(element => {
    observer.observe(element);
  });
}

// Animation de la machine à écrire
export function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter');
  if (!typewriterElement) return;
  
  const roles = ['Web Developer', 'Mobile Developer', 'UI/UX Designer'];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1000; // Pause avant effacement
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
    
    setTimeout(type, typingSpeed);
  }
  
  setTimeout(type, 1000);
}
