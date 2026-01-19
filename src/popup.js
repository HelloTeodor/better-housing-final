console.log("popup.js loaded");

let popupEl;

function createPopup() {
  popupEl = document.createElement("div");
  popupEl.style.position = "fixed";
  popupEl.style.bottom = "24px";
  popupEl.style.left = "50%";
  popupEl.style.transform = "translateX(-50%)";
  popupEl.style.padding = "12px 20px";
  popupEl.style.borderRadius = "8px";
  popupEl.style.color = "white";
  popupEl.style.fontWeight = "600";
  popupEl.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
  popupEl.style.zIndex = "10000";
  popupEl.style.opacity = "0";
  popupEl.style.transition = "opacity 0.3s ease";

  document.body.appendChild(popupEl);
}

export function showPopup(message, type = "success") {
  if (!popupEl) createPopup();

  popupEl.textContent = message;
  popupEl.style.background = type === "success" ? "#16a34a" : "#dc2626";

  popupEl.style.opacity = "1";

  setTimeout(() => {
    popupEl.style.opacity = "0";
  }, 3000);
}
