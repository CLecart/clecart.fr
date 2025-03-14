/**
 * Module pour gérer la navigation et le menu mobile
 */
export function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');
  
  if (navToggle && navMenu) {
    // Toggle du menu mobile
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
    
    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('nav ul li a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navMenu.classList.remove('active');
        }
      });
    });
    
    // Fermer le menu quand on clique ailleurs
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && 
          navMenu.classList.contains('active') && 
          !e.target.closest('nav') && 
          !e.target.closest('.nav-toggle')) {
        navMenu.classList.remove('active');
      }
    });
  }
  
  // Navigation fluide pour les ancres
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Effet de défilement pour le header
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}
