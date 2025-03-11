// Script unifié pour gérer le mode sombre sur toutes les pages

document.addEventListener("DOMContentLoaded", function () {
  // Vérifier la préférence stockée
  const isDarkMode = localStorage.getItem("darkMode") === "enabled";

  // Appliquer le mode sombre si activé
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }

  // Vérifier si nous sommes sur la page d'accueil ou une page de détail
  const isHomePage = !document.querySelector(".description");

  // Créer ou récupérer le bouton toggle
  let darkModeToggle = document.querySelector(".dark-mode-toggle");

  if (!darkModeToggle) {
    darkModeToggle = document.createElement("button");
    darkModeToggle.className = "dark-mode-toggle";

    // Insérer le bouton au bon endroit selon la page
    if (isHomePage) {
      const rightContent = document.querySelector(".right-content");
      if (rightContent) {
        rightContent.appendChild(darkModeToggle);
      }
    }
  }

  // Mettre à jour l'icône initiale
  darkModeToggle.innerHTML = isDarkMode
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';

  // Gérer le clic sur le bouton
  darkModeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const newDarkMode = document.body.classList.contains("dark-mode");

    // Mettre à jour l'icône
    this.innerHTML = newDarkMode
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';

    // Sauvegarder la préférence
    localStorage.setItem("darkMode", newDarkMode ? "enabled" : "disabled");

    // Fix section title colors after dark mode toggle
    fixSectionTitles();
  });

  // Function to fix section title colors in dark mode
  function fixSectionTitles() {
    if (document.body.classList.contains("dark-mode")) {
      // Select all section headers
      document.querySelectorAll(".section-header h2").forEach((title) => {
        title.style.color = "var(--primary)";
      });

      // Specifically target Skills section header
      const skillsHeader = document.querySelector("#skills .section-header h2");
      if (skillsHeader) {
        skillsHeader.style.color = "var(--primary)";
      }
    }
  }

  // Run when page loads
  fixSectionTitles();
});
