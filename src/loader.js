// loader.js
const loadingOverlay = document.createElement("div");
loadingOverlay.id = "loadingOverlay";
loadingOverlay.style.position = "fixed";
loadingOverlay.style.top = 0;
loadingOverlay.style.left = 0;
loadingOverlay.style.width = "100%";
loadingOverlay.style.height = "100%";
loadingOverlay.style.backgroundColor = "rgba(0,0,0,0.4)";
loadingOverlay.style.backdropFilter = "blur(4px)";
loadingOverlay.style.display = "none";
loadingOverlay.style.zIndex = 9999;
loadingOverlay.style.alignItems = "center";
loadingOverlay.style.justifyContent = "center";

const loaderBox = document.createElement("div");
loaderBox.style.backgroundColor = "white";
loaderBox.style.padding = "1rem 1.5rem";
loaderBox.style.borderRadius = "8px";
loaderBox.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
loaderBox.style.textAlign = "center";
loaderBox.style.display = "flex";
loaderBox.style.flexDirection = "column";
loaderBox.style.alignItems = "center";

const spinner = document.createElement("div");
spinner.style.width = "32px";
spinner.style.height = "32px";
spinner.style.border = "4px solid #ddd";
spinner.style.borderTop = "4px solid #3b82f6";
spinner.style.borderRadius = "50%";
spinner.style.animation = "spin 0.7s linear infinite";
spinner.style.marginBottom = "0.5rem";

const text = document.createElement("p");
text.textContent = "Sending...";
text.style.fontWeight = "600";

loaderBox.appendChild(spinner);
loaderBox.appendChild(text);
loadingOverlay.appendChild(loaderBox);
document.body.appendChild(loadingOverlay);

const style = document.createElement("style");
style.textContent = `
@keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);

export function showLoader() {
  loadingOverlay.style.display = "flex";
}
export function hideLoader() {
  loadingOverlay.style.display = "none";
}

// Optional: create temporary message under submit button
export function showMessage(message, success = true) {
  let msg = document.getElementById("formMessage");
  if (!msg) {
    msg = document.createElement("div");
    msg.id = "formMessage";
    msg.style.marginTop = "0.5rem";
    msg.style.textAlign = "center";
    msg.style.fontWeight = "600";
    document.getElementById("companyForm").appendChild(msg);
  }
  msg.textContent = message;
  msg.style.color = success ? "green" : "red";
  setTimeout(() => {
    msg.textContent = "";
  }, 4000);
}
