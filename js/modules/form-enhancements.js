/**
 * Form enhancement module with autocomplete detection
 * @module FormEnhancements
 */

/**
 * Initialize form validation and visual enhancements
 * @function initFormEnhancements
 * @description Handles form validation states and autocomplete detection
 */
export function initFormEnhancements() {
  const inputs = document.querySelectorAll("input[type='text'], input[type='email'], textarea");

  inputs.forEach((input) => {
    input.addEventListener("input", () => checkInputContent(input));
    input.addEventListener("blur", () => checkInputContent(input));
    input.addEventListener("change", () => checkInputContent(input));

    const observer = new MutationObserver(() => {
      checkInputContent(input);
    });

    observer.observe(input, {
      attributes: true,
      attributeFilter: ["value"],
    });

    input.addEventListener("focus", () => {
      checkInputContent(input);
    });

    setTimeout(() => checkInputContent(input), 100);
    setTimeout(() => checkInputContent(input), 500);
    setTimeout(() => checkInputContent(input), 1000);
  });

  function checkInputContent(input) {
    const hasContent = input.value.trim().length > 0;
    const isEmail = input.type === "email";

    if (hasContent) {
      if (isEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(input.value);
        input.classList.toggle("email-valid", isValid);
        input.classList.toggle("has-content", !isValid);
      } else {
        input.classList.add("has-content");
      }
    } else {
      input.classList.remove("has-content", "email-valid");
    }

    setTimeout(() => {
      const computedStyle = window.getComputedStyle(input);
      const hasAutoFillShadow = computedStyle.boxShadow.includes("rgb(232, 240, 254)") ||
                               computedStyle.backgroundColor.includes("rgb(232, 240, 254)");
      
      if (hasAutoFillShadow && input.value.trim().length > 0) {
        if (input.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const isValid = emailRegex.test(input.value);
          input.classList.toggle("email-valid", isValid);
          input.classList.toggle("has-content", !isValid);
        } else {
          input.classList.add("has-content");
        }
      }
    }, 50);
  }

  const form = document.querySelector("#contact-form");
  if (form) {
    const intervalId = setInterval(() => {
      inputs.forEach((input) => {
        checkInputContent(input);
      });
    }, 2000);

    setTimeout(() => {
      clearInterval(intervalId);
    }, 10000);
  }
}
