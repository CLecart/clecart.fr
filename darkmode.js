// Script pour gérer le mode sombre sur les pages détail
document.addEventListener("DOMContentLoaded", function () {
  // Vérifier la préférence stockée
  const isDarkMode = localStorage.getItem("darkMode") === "enabled";

  // Appliquer le mode sombre si activé
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }

  // Créer le bouton toggle
  const toggle = document.createElement("button");
  toggle.className = "dark-mode-toggle";
  toggle.innerHTML = isDarkMode
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
  document.body.appendChild(toggle);

  // Gérer le clic sur le bouton
  toggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const newDarkMode = document.body.classList.contains("dark-mode");

    // Mettre à jour l'icône
    this.innerHTML = newDarkMode
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';

    // Sauvegarder la préférence
    localStorage.setItem("darkMode", newDarkMode ? "enabled" : "disabled");
  });
});
