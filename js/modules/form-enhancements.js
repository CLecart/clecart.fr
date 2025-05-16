export function initFormEnhancements() {
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

  function checkInputContent(input) {
    if (input.value && input.value.trim() !== "") {
      input.classList.add("has-content");
    } else {
      input.classList.remove("has-content");
    }
  }
}
