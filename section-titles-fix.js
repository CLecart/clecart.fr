/**
 * Fix for section titles in dark mode
 * Ensures all section headers have the blue color in dark mode
 */

document.addEventListener("DOMContentLoaded", function () {
  // Function to fix section title colors
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

  // Run when dark mode toggle is clicked
  document.addEventListener("click", function (e) {
    if (e.target.closest(".dark-mode-toggle")) {
      // Small delay to ensure dark mode class is applied first
      setTimeout(fixSectionTitles, 50);
    }
  });
});
