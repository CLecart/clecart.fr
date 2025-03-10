/**
 * Enhanced Dark Mode Toggle with improved responsive positioning
 * - Ensures the button doesn't overlap with navigation links
 * - Places toggle to the left of hamburger menu on mobile
 * - Maintains consistent styling across all screen sizes
 * - Preserves original header gradient and skill box content
 */

document.addEventListener("DOMContentLoaded", function () {
  // Determine if we're on homepage or a detail page
  const isHomePage = !document.querySelector(".description");

  // Store original skill card text if on homepage
  let skillCardTexts = {};
  if (isHomePage) {
    document.querySelectorAll("#skills .skill-card p").forEach((p, index) => {
      skillCardTexts[index] = p.textContent;
    });
  }

  // Check stored preference
  const isDarkMode = localStorage.getItem("darkMode") === "enabled";

  // Apply dark mode if enabled
  if (isDarkMode) {
    document.body.classList.add("dark-mode");

    // Ensure header keeps its gradient
    const header = document.querySelector("header");
    if (header) {
      header.style.background = "var(--gradient-1)";
    }
  }

  // Add homepage class to help with styling
  if (isHomePage) {
    document.body.classList.add("homepage");
  }

  // Create dark mode toggle button
  const toggle = document.createElement("button");
  toggle.className = "dark-mode-toggle";
  toggle.setAttribute(
    "aria-label",
    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
  );
  toggle.innerHTML = isDarkMode
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';

  if (isHomePage) {
    // On home page, place the toggle in right-content
    const rightContent = document.querySelector(".right-content");
    const navToggle = document.querySelector(".nav-toggle");

    if (rightContent) {
      // On mobile, ensure toggle is placed to the left of hamburger menu
      if (window.innerWidth <= 768 && navToggle) {
        rightContent.insertBefore(toggle, navToggle);
      } else {
        rightContent.appendChild(toggle);
      }
    } else {
      document.body.appendChild(toggle);
    }
  } else {
    // On detail pages, add to header
    const header = document.querySelector("header");
    const backBtn = document.querySelector(".back-btn");

    if (header) {
      // Position it to avoid overlapping with back button
      header.appendChild(toggle);

      // Add a container div to help with positioning
      if (backBtn) {
        const headerControls = document.createElement("div");
        headerControls.className = "header-controls";

        // Move back button into the container
        backBtn.parentNode.insertBefore(headerControls, backBtn);
        headerControls.appendChild(backBtn);
        headerControls.appendChild(toggle);
      }
    } else {
      document.body.appendChild(toggle);
    }
  }

  // Handle toggle click
  toggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const newDarkMode = document.body.classList.contains("dark-mode");

    // Update icon
    this.innerHTML = newDarkMode
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';

    // Update accessibility label
    this.setAttribute(
      "aria-label",
      newDarkMode ? "Switch to light mode" : "Switch to dark mode"
    );

    // Save preference
    localStorage.setItem("darkMode", newDarkMode ? "enabled" : "disabled");

    // Ensure header keeps its gradient regardless of mode
    const header = document.querySelector("header");
    if (header) {
      header.style.background = "var(--gradient-1)";
    }

    // Restore original skill card text content if texts were changed
    if (isHomePage) {
      document.querySelectorAll("#skills .skill-card p").forEach((p, index) => {
        if (skillCardTexts[index] && p.textContent !== skillCardTexts[index]) {
          p.textContent = skillCardTexts[index];
        }
      });
    }
  });

  // Ensure header has gradient on page load
  const header = document.querySelector("header");
  if (header) {
    header.style.background = "var(--gradient-1)";
  }

  // Handle window resize to reposition button if needed
  window.addEventListener("resize", function () {
    if (isHomePage) {
      const rightContent = document.querySelector(".right-content");
      const navToggle = document.querySelector(".nav-toggle");

      if (rightContent && navToggle && window.innerWidth <= 768) {
        // Ensure button is before hamburger menu on mobile
        if (toggle.nextElementSibling === navToggle) return;
        rightContent.insertBefore(toggle, navToggle);
      }
    }
  });

  // Ensure skill card texts remain untouched
  if (isHomePage) {
    document.querySelectorAll("#skills .skill-card p").forEach((p, index) => {
      if (skillCardTexts[index] && p.textContent !== skillCardTexts[index]) {
        p.textContent = skillCardTexts[index];
      }
    });
  }
});
