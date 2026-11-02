/**
 * Navigation management
 * @author Christophe Lecart
 */

/**
 * Bring a section to rest just under the fixed header
 * @function scrollToSection
 * @description Lands the section so its top rule meets the header's, which sits
 * at bottom: -3px. Exported so anything that needs to return to a section — the
 * nav links, the project grid collapsing — lands identically; a second copy of
 * this arithmetic would drift from the header's CSS the first time it changes.
 * @param {string} targetId - Hash selector of the target section, e.g. "#projects"
 * @returns {void}
 */
export function scrollToSection(targetId) {
  const targetElement = document.querySelector(targetId);
  const header = document.querySelector("header");

  if (!targetElement || !header) {
    return;
  }

  const targetPosition =
    targetElement.getBoundingClientRect().top + globalThis.scrollY;
  const headerTraitOffset = 3;
  const additionalOffset = targetId === "#skills" ? 50 : 0;
  const scrollTarget =
    targetPosition - header.offsetHeight + headerTraitOffset + additionalOffset;

  globalThis.scrollTo({
    top: Math.max(0, scrollTarget),
    behavior: "smooth",
  });
}

/**
 * Wire the burger menu, its dismissal paths, and smooth anchor scrolling
 * @function initNavigation
 * @description Visibility is driven imperatively alongside the active class because a closed-but-visible menu stays clickable and focusable off-screen. Hiding is therefore deferred by the menu transition duration, so the slide-out plays out before the element leaves the accessibility tree, and each deferred hide re-checks the class in case the menu was reopened meanwhile.
 * @returns {void}
 */
export function initNavigation() {
  const MENU_TRANSITION_DURATION = 300;
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("nav ul");
  const menuIcon = navToggle?.querySelector("use");
  const sprite = menuIcon?.getAttribute("href")?.split("#")[0];

  if (!navToggle || !navMenu) {
    return;
  }

  navMenu.classList.remove("active");

  if (globalThis.innerWidth <= 768) {
    navMenu.style.visibility = "hidden";
  }

  /**
   * Size the open mobile menu to its longest link
   * @function setMenuWidth
   * @description Measures scrollWidth rather than offsetWidth so the untruncated text drives the result, then clamps to a 180px floor so a menu of short labels still reads as a panel. Above the mobile breakpoint the inline width is cleared instead of computed, handing sizing back to the stylesheet.
   * @returns {void}
   */
  function setMenuWidth() {
    if (globalThis.innerWidth <= 768 && navMenu.classList.contains("active")) {
      const maxWidth = Array.from(navMenu.querySelectorAll("li a")).reduce(
        (width, link) => Math.max(width, link.scrollWidth + 30),
        0
      );
      navMenu.style.width = `${Math.max(maxWidth, 180)}px`;
    } else {
      navMenu.style.width = "";
    }
  }

  /**
   * Draw the toggle as a cross while the menu is open, a burger otherwise
   * @function showMenuIcon
   * @description Only the fragment of the <use> reference changes: the sprite path stays the one the page's markup wrote, so no URL here can drift from the HTML. The <svg> keeps the burger's viewBox; the default preserveAspectRatio centres the narrower cross inside it, so both glyphs share the button's centre.
   * @param {boolean} open - Whether the menu is now open
   * @returns {void}
   */
  function showMenuIcon(open) {
    menuIcon?.setAttribute("href", `${sprite}#${open ? "xmark" : "bars"}`);
  }

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    showMenuIcon(navMenu.classList.contains("active"));

    if (navMenu.classList.contains("active")) {
      navMenu.style.visibility = "visible";
      setMenuWidth();
      const headerHeight = document.querySelector("header")?.offsetHeight ?? 0;
      navMenu.style.top = `${headerHeight + 5}px`;
    } else {
      setTimeout(() => {
        if (!navMenu.classList.contains("active")) {
          navMenu.style.visibility = "hidden";
        }
      }, MENU_TRANSITION_DURATION);
    }
  });

  document.querySelectorAll("nav ul li a").forEach((link) => {
    link.addEventListener("click", () => {
      if (globalThis.innerWidth <= 768) {
        navMenu.classList.remove("active");
        showMenuIcon(false);
        setTimeout(() => {
          if (!navMenu.classList.contains("active")) {
            navMenu.style.visibility = "hidden";
          }
        }, MENU_TRANSITION_DURATION);
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (
      globalThis.innerWidth <= 768 &&
      navMenu.classList.contains("active") &&
      !e.target.closest("nav") &&
      !e.target.closest(".nav-toggle")
    ) {
      navMenu.classList.remove("active");
      showMenuIcon(false);
      setTimeout(() => {
        if (!navMenu.classList.contains("active")) {
          navMenu.style.visibility = "hidden";
        }
      }, MENU_TRANSITION_DURATION);
    }
  });

  globalThis.addEventListener("resize", () => {
    setMenuWidth();
    if (globalThis.innerWidth > 768) {
      navMenu.style.visibility = "visible";
    } else if (!navMenu.classList.contains("active")) {
      navMenu.style.visibility = "hidden";
    }
  });

  document
    .querySelectorAll('a[href^="#"]:not([href="#"])')
    .forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        scrollToSection(this.getAttribute("href"));
      });
    });
}
