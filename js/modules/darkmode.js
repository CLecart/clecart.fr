/**
 * Module pour gérer le mode sombre
 */
export function initDarkMode() {
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Créer le bouton de toggle mode sombre s'il n'existe pas
  let darkModeToggle = document.querySelector(".dark-mode-toggle");
  if (!darkModeToggle) {
    darkModeToggle = document.createElement("button");
    darkModeToggle.className = "dark-mode-toggle";
    
    // Ajouter le bouton au menu de navigation
    const rightContent = document.querySelector(".right-content");
    if (rightContent) {
      rightContent.appendChild(darkModeToggle);
    }
  }
  
  // Appliquer le mode sombre en fonction de la préférence stockée
  function checkDarkMode() {
    if (localStorage.getItem('darkMode') === 'enabled' || 
        (localStorage.getItem('darkMode') === null && prefersDarkScheme.matches)) {
      document.body.classList.add('dark-mode');
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.body.classList.remove('dark-mode');
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  }
  
  // Activer/désactiver le mode sombre
  function toggleDarkMode() {
    if (document.body.classList.contains('dark-mode')) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }
  
  // Initialiser
  checkDarkMode();
  
  // Ajouter l'écouteur d'événement
  darkModeToggle.addEventListener('click', toggleDarkMode);
}
