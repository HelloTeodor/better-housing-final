// /src/loader.js

// Create overlay
const loadingOverlay = document.createElement("div");
Object.assign(loadingOverlay.style, {
  position: "fixed",
  inset: "0",
  backgroundColor: "rgba(0,0,0,0.4)",
  backdropFilter: "blur(4px)",
  display: "none",
  zIndex: "9999",
  alignItems: "center",
  justifyContent: "center",
});

// Box
const box = document.createElement("div");
Object.assign(box.style, {
  background: "white",
  padding: "1.25rem 1.75rem",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  minWidth: "220px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  transition: "transform 0.2s ease, opacity 0.2s ease",
});

// Spinner
const spinner = document.createElement("div");
Object.assign(spinner.style, {
  width: "34px",
  height: "34px",
  border: "4px solid #e5e7eb",
  borderTop: "4px solid #3b82f6",
  borderRadius: "50%",
  animation: "spin 0.7s linear infinite",
});

// Text
const text = document.createElement("div");
Object.assign(text.style, {
  fontWeight: "600",
  fontSize: "0.95rem",
  color: "#111827",
  textAlign: "center",
});

box.appendChild(spinner);
box.appendChild(text);
loadingOverlay.appendChild(box);
document.body.appendChild(loadingOverlay);

// Keyframes
const style = document.createElement("style");
style.textContent = `
@keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);

// ---------------- API ----------------

export function showLoader(message = "Sending...") {
  text.textContent = message;
  text.style.color = "#111827";

  spinner.style.display = "block";
  spinner.style.borderTopColor = "#3b82f6";

  loadingOverlay.style.display = "flex";
}

export function showSuccess(message = "Submitted successfully!") {
  spinner.style.display = "none";
  text.textContent = message;
  text.style.color = "#16a34a";

  autoHide();
}

export function showError(message = "Submission failed") {
  spinner.style.display = "none";
  text.textContent = message;
  text.style.color = "#dc2626";

  autoHide();
}

function autoHide() {
  setTimeout(() => {
    loadingOverlay.style.display = "none";
    spinner.style.display = "block";
  }, 1800);
}
