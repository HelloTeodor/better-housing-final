import { showLoader, showSuccess, showError } from "./loader.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("companyForm");
  const fileInputOne = document.getElementById("fileInputOne");
  const fileInputTwo = document.getElementById("fileInputTwo");
  const preview = document.getElementById("photoPreview");

  if (!form) return;

  let allPhotos = [];

  function updatePreview() {
    preview.innerHTML = "";
    allPhotos.forEach((file, idx) => {
      const div = document.createElement("div");
      div.className = "relative w-24 h-24 border rounded overflow-hidden";

      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.className = "w-full h-full object-cover";
      div.appendChild(img);

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "×";
      removeBtn.type = "button";
      removeBtn.className =
        "absolute top-0 right-0 bg-red-500 text-white rounded-full px-1";
      removeBtn.onclick = () => {
        allPhotos.splice(idx, 1);
        updatePreview();
      };
      div.appendChild(removeBtn);

      preview.appendChild(div);
    });
  }

  fileInputOne.addEventListener("change", (e) => {
    allPhotos.push(...e.target.files);
    updatePreview();
    fileInputOne.value = "";
  });

  fileInputTwo.addEventListener("change", (e) => {
    allPhotos.push(...e.target.files);
    updatePreview();
    fileInputTwo.value = "";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoader("Sending...");

    const formData = new FormData(form);

    allPhotos.forEach((file) => formData.append("photos", file)); // append files

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        body: formData, // multipart/form-data
      });

      if (res.ok) {
        showSuccess("Form submitted successfully!");
        form.reset();
        allPhotos = [];
        updatePreview();
      } else {
        const err = await res.json();
        showError(err.error || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      showError("Network error. Please try again.");
    }
  });
});
