/**
 * @fileoverview Module d'améliorations UX pour les formulaires
 * @description Gère la validation en temps réel, les effets visuels et l'autocomplétion
 * @version 1.0.0
 * @author Christophe Lecart <djlike@hotmail.fr>
 */

/**
 * Initialise les améliorations UX sur tous les formulaires de la page
 * @function initFormEnhancements
 * @description Configure la validation en temps réel avec coches vertes et détection d'autocomplétion
 * @returns {void}
 * @example
 * // Activer les améliorations de formulaire
 * initFormEnhancements();
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
      checkInputContent(input); // Vérifier le contenu au focus (autocomplétion)
    });
    input.addEventListener("blur", () => {
      input.removeAttribute("data-focused");
      checkInputContent(input);
    });

    // Détection spéciale pour l'autocomplétion
    input.addEventListener("change", () => {
      checkInputContent(input);
    });
  });

  // Vérifications multiples pour autocomplétion
  const checkTimes = [100, 300, 500, 800, 1000, 1500, 2000];
  checkTimes.forEach((delay) => {
    setTimeout(() => {
      formInputs.forEach(checkInputContent);
    }, delay);
  });

  // Détection d'autocomplétion avec MutationObserver
  formInputs.forEach((input) => {
    if (window.MutationObserver) {
      const observer = new MutationObserver(() => {
        setTimeout(() => checkInputContent(input), 50);
        setTimeout(() => checkInputContent(input), 200);
      });
      observer.observe(input, {
        attributes: true,
        attributeFilter: ["value", "class", "style"],
        childList: true,
        subtree: true,
      });
    }

    // Vérification sur animationstart (détecte webkit-autofill)
    input.addEventListener("animationstart", (e) => {
      if (e.animationName === "autofill-detect") {
        setTimeout(() => checkInputContent(input), 10);
        setTimeout(() => checkInputContent(input), 100);
        setTimeout(() => checkInputContent(input), 300);
      }
    });

    // Détection supplémentaire par événements multiples avec plus de vérifications
    ["input", "change", "blur", "focus", "keyup", "keydown"].forEach(
      (eventType) => {
        input.addEventListener(eventType, () => {
          setTimeout(() => checkInputContent(input), 10);
          setTimeout(() => checkInputContent(input), 50);
          setTimeout(() => checkInputContent(input), 150);
          setTimeout(() => checkInputContent(input), 300);
        });
      }
    );

    // Vérification périodique pour l'autocomplétion stubborn
    setInterval(() => {
      if (input.matches(":-webkit-autofill") || input.value.length > 0) {
        checkInputContent(input);
      }
    }, 500);
  });

  // Gestion de l'affichage des erreurs de validation
  function checkInputContent(input) {
    if (input.value && input.value.trim() !== "") {
      input.classList.add("has-content");

      // Validation stricte pour email : doit contenir @ ET .
      if (input.type === "email") {
        const email = input.value.trim();
        if (email.includes("@") && email.includes(".")) {
          input.classList.add("email-valid");
        } else {
          input.classList.remove("email-valid");
        }
      }
    } else {
      input.classList.remove("has-content");
      if (input.type === "email") {
        input.classList.remove("email-valid");
      }
    }
  }
}
