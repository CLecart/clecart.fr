/**
 * Module de gestion du mode sombre
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
    // Désactivation des transitions
    document.body.classList.add("theme-transitioning");

    // Cibler les éléments problématiques
    document
      .querySelectorAll(
        ".hero-content *, .fade-in, .slide-left, .slide-right, .btn, .btn-secondary, .contact-method, .form-group input, .form-group textarea, .contact-info, .contact-form"
      )
      .forEach((el) => {
        el.classList.add("no-transition");
        el.style.backgroundColor = "transparent";
      });

    body.classList.add("dark-mode");
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem("dark-mode", "enabled");

    // Réactiver les animations après le changement
    setTimeout(() => {
      document.querySelectorAll(".no-transition").forEach((el) => {
        el.classList.remove("no-transition");
        el.style.backgroundColor = "";
      });
      document.body.classList.remove("theme-transitioning");
    }, 150);
  }

  // Fonction pour appliquer le mode clair
  function applyLightMode() {
    // Désactivation des transitions
    document.body.classList.add("theme-transitioning");

    // Cibler les éléments problématiques
    document
      .querySelectorAll(
        ".hero-content *, .fade-in, .slide-left, .slide-right, .btn, .btn-secondary, .contact-method, .form-group input, .form-group textarea, .contact-info, .contact-form"
      )
      .forEach((el) => {
        el.classList.add("no-transition");
        el.style.backgroundColor = "transparent";
      });

    body.classList.remove("dark-mode");
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem("dark-mode", "disabled");

    // Réactiver les animations après le changement
    setTimeout(() => {
      document.querySelectorAll(".no-transition").forEach((el) => {
        el.classList.remove("no-transition");
        el.style.backgroundColor = "";
      });
      document.body.classList.remove("theme-transitioning");
    }, 150);
  }

  // Vérifier les préférences utilisateur
  const darkModePreference = localStorage.getItem("dark-mode");

  // Définir le mode par défaut
  if (darkModePreference === "enabled") {
    applyDarkMode();
  } else if (darkModePreference === "disabled") {
    applyLightMode();
  } else {
    // Si aucune préférence n'est enregistrée, utiliser le mode sombre par défaut
    applyDarkMode();
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
