// /src/loader.js

// Create loader overlay (module)
const loadingOverlay = document.createElement("div");
loadingOverlay.id = "loadingOverlay";
Object.assign(loadingOverlay.style, {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.4)",
  backdropFilter: "blur(4px)",
  display: "none",
  zIndex: "9999",
  alignItems: "center",
  justifyContent: "center",
});

// Inner box
const box = document.createElement("div");
Object.assign(box.style, {
  background: "white",
  padding: "1rem 1.5rem",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
});

// spinner
const spinner = document.createElement("div");
Object.assign(spinner.style, {
  width: "32px",
  height: "32px",
  border: "4px solid #ddd",
  borderTop: "4px solid #3b82f6",
  borderRadius: "50%",
  animation: "spin 0.7s linear infinite",
  marginBottom: "8px",
});

const text = document.createElement("div");
text.textContent = "Sending...";
text.style.fontWeight = "600";

box.appendChild(spinner);
box.appendChild(text);
loadingOverlay.appendChild(box);
document.body.appendChild(loadingOverlay);

// keyframes
const style = document.createElement("style");
style.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
document.head.appendChild(style);

// exported functions
export function showLoader() {
  loadingOverlay.style.display = "flex";
}
export function hideLoader() {
  loadingOverlay.style.display = "none";
}
