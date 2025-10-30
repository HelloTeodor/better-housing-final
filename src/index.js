document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu");
  const nav = document.querySelector('[data-name="linksMobileNav"]');

  // Initial state (hidden)
  nav.style.top = "-100vh";
  nav.style.transition = "top 0.2s ease-in-out";

  let menuOpen = false;

  const closeMenu = () => {
    nav.style.top = "-100vh";
    menuOpen = false;
  };

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent triggering document click
    if (!menuOpen) {
      nav.style.top = "3.45rem"; // adjust to your header height
      menuOpen = true;
    } else {
      closeMenu();
    }
  });

  // Close menu when clicking any link inside it
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close when clicking outside of the nav and menu button
  document.addEventListener("click", (e) => {
    if (menuOpen && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
      closeMenu();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const logoOne = document.getElementById("logoOne");
  const logoTwo = document.getElementById("logoTwo");
  const heroAds = document.getElementById("heroAds");

  // For safety, always check if the element exists before adding the listener
  if (logoOne)
    logoOne.onclick = () => (window.location.href = "/index.html#hero");

  if (logoTwo)
    logoTwo.onclick = () => (window.location.href = "/index.html#hero");

  if (heroAds)
    heroAds.onclick = () => (window.location.href = "/index.html#contact");
});
