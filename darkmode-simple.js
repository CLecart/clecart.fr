// Simple dark mode that always works
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".dark-mode-toggle");
  const body = document.body;

  if (!toggle) {
    console.error("Toggle not found");
    return;
  }

  // Check saved preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    toggle.querySelector("i").className = "fas fa-sun";
  }

  // Toggle functionality
  toggle.addEventListener("click", function () {
    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");

    // Update icon
    const icon = toggle.querySelector("i");
    icon.className = isDark ? "fas fa-sun" : "fas fa-moon";

    // Save preference
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});
