/**
 * Module de gestion du mode sombre
 * Configure le basculement entre thèmes clair et sombre
 */
export function initDarkMode() {
  const body = document.body;
  const darkModeToggle = document.createElement("button");
  darkModeToggle.classList.add("dark-mode-toggle");
  darkModeToggle.setAttribute("aria-label", "Toggle dark mode");
  darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';

  // Insérer le bouton dans le header
  if (document.querySelector(".header-buttons")) {
    document.querySelector(".header-buttons").prepend(darkModeToggle);
  } else if (document.querySelector(".right-content")) {
    document.querySelector(".right-content").appendChild(darkModeToggle);
  }

  // Fonction pour appliquer le mode sombre
  function applyDarkMode() {
    body.classList.add("dark-mode");
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem("dark-mode", "enabled");
  }

  // Fonction pour appliquer le mode clair
  function applyLightMode() {
    body.classList.remove("dark-mode");
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem("dark-mode", "disabled");
  }

  // Vérifier les préférences utilisateur
  const darkModePreference = localStorage.getItem("dark-mode");
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  // Définir le mode sombre par défaut
  if (darkModePreference === null) {
    // Si aucune préférence n'est enregistrée, utiliser le mode sombre par défaut
    applyDarkMode();
  } else if (darkModePreference === "enabled") {
    // Si le mode sombre était activé précédemment
    applyDarkMode();
  } else {
    // Si le mode sombre était désactivé précédemment
    applyLightMode();
  }

  // Ajouter l'événement de basculement
  darkModeToggle.addEventListener("click", () => {
    if (body.classList.contains("dark-mode")) {
      applyLightMode();
    } else {
      applyDarkMode();
    }
  });
}
