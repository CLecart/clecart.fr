/**
 * Module pour améliorer le comportement des formulaires
 * Utilise une approche efficace pour gérer les états des champs de formulaire
 */
export function initFormEnhancements() {
  // Gérer l'activation des champs en fonction de leur contenu
  const formInputs = document.querySelectorAll(
    ".form-group input, .form-group textarea"
  );

  formInputs.forEach((input) => {
    const placeholderValue = " "; // Espace vide pour que :not(:placeholder-shown) fonctionne

    // Ajouter/maintenir placeholder si nécessaire
    if (!input.hasAttribute("placeholder")) {
      input.setAttribute("placeholder", placeholderValue);
    }

    // Vérifier l'état initial
    checkInputContent(input);

    // Vérifier à chaque changement
    input.addEventListener("input", () => {
      checkInputContent(input);
    });

    // Vérifier au focus et blur
    input.addEventListener("focus", () => {
      input.setAttribute("data-focused", "true");
    });

    input.addEventListener("blur", () => {
      input.removeAttribute("data-focused");
      checkInputContent(input);
    });
  });

  function checkInputContent(input) {
    // Cette fonction aide à maintenir une cohérence visuelle
    // sans recourir à des !important
    if (input.value && input.value.trim() !== "") {
      input.classList.add("has-content");
    } else {
      input.classList.remove("has-content");
    }
  }
}
