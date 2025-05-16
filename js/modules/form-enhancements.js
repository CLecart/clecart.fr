// form-enhancements.js
// Module d'améliorations UX pour les formulaires (focus, validation, etc.)

/**
 * Initialise les améliorations UX sur les formulaires
 */
export function initFormEnhancements() {
  // Ajout d'effets de focus et de validation sur les champs de formulaire
  const formInputs = document.querySelectorAll(
    ".form-group input, .form-group textarea"
  );

  formInputs.forEach((input) => {
    const placeholderValue = " ";
    if (!input.hasAttribute("placeholder")) {
      input.setAttribute("placeholder", placeholderValue);
    }
    checkInputContent(input);
    input.addEventListener("input", () => {
      checkInputContent(input);
    });
    input.addEventListener("focus", () => {
      input.setAttribute("data-focused", "true");
    });
    input.addEventListener("blur", () => {
      input.removeAttribute("data-focused");
      checkInputContent(input);
    });
  });

  // Gestion de l'affichage des erreurs de validation
  function checkInputContent(input) {
    if (input.value && input.value.trim() !== "") {
      input.classList.add("has-content");
    } else {
      input.classList.remove("has-content");
    }
  }
}
