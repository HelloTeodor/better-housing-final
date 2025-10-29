document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu");
  const nav = document.querySelector('[data-name="linksMobileNav"]');

  // Start hidden above the viewport
  nav.style.top = "-100vh";
  nav.style.transition = "top 0.2s ease-in-out";

  let menuOpen = false;

  menuBtn.addEventListener("click", () => {
    if (!menuOpen) {
      // Slide down to visible position
      nav.style.top = "3.45rem"; // same as top-13 (~52px)
      menuOpen = true;
    } else {
      // Slide back up
      nav.style.top = "-100vh";
      menuOpen = false;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const logoOne = document.getElementById("logoOne");
  const logoTwo = document.getElementById("logoTwo");

  // For safety, always check if the element exists before adding the listener
  if (logoOne)
    logoOne.onclick = () => (window.location.href = "/index.html#hero");

  if (logoTwo)
    logoTwo.onclick = () => (window.location.href = "/index.html#hero");
});
