import { showLoader, showSuccess, showError } from "./loader.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("companyForm");
  if (!form) return;

  // ---------- FLATPICKR ----------
  flatpickr("#fromDate", { dateFormat: "d/m/Y", allowInput: true });
  flatpickr("#toDate", { dateFormat: "d/m/Y", allowInput: true });

  // ---------- PHOTO INPUTS ----------
  const photoInput1 = document.getElementById("photoInput1");
  const photoInput2 = document.getElementById("photoInput2");
  const photoPreview = document.getElementById("photoPreview");

  let allPhotos = [];

  function updatePreview() {
    photoPreview.innerHTML = "";
    allPhotos.forEach((file, idx) => {
      const div = document.createElement("div");
      div.className = "relative w-24 h-24 border rounded overflow-hidden";

      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.className = "w-full h-full object-cover";
      div.appendChild(img);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "×";
      removeBtn.className =
        "absolute top-0 right-0 bg-red-500 text-white rounded-full px-1";
      removeBtn.onclick = () => {
        allPhotos.splice(idx, 1);
        updatePreview();
      };
      div.appendChild(removeBtn);

      photoPreview.appendChild(div);
    });
  }

  // Add files to allPhotos array
  [photoInput1, photoInput2].forEach((input) => {
    input.addEventListener("change", (e) => {
      allPhotos.push(...e.target.files);
      updatePreview();
      input.value = ""; // reset input
    });
  });

  // ---------- FORM SUBMIT ----------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoader("Sending...");

    // Use FormData to include files
    const formData = new FormData(form);

    // Append all selected photos
    allPhotos.forEach((file) => formData.append("photos", file));

    // Convert country select values to text if needed
    const countrySelect = document.getElementById("country");
    if (countrySelect && countrySelect.value)
      formData.set(
        "country",
        countrySelect.options[countrySelect.selectedIndex].text,
      );

    const countryTwoSelect = document.getElementById("countryTwo");
    if (countryTwoSelect && countryTwoSelect.value)
      formData.set(
        "preferredCountry",
        countryTwoSelect.options[countryTwoSelect.selectedIndex].text,
      );

    // Gather multiple preferred cities
    const cityTwoWrapper = document.getElementById("cityTwoWrapper");
    const preferredCities = [];
    cityTwoWrapper
      ?.querySelectorAll(".cityTwo")
      .forEach((sel) => sel.value && preferredCities.push(sel.value));

    formData.delete("preferredCity"); // remove old keys
    preferredCities.forEach((city) => formData.append("preferredCity", city));

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        body: formData, // multipart/form-data includes files
      });

      if (res.ok) {
        showSuccess("Form submitted successfully!");
        form.reset();
        allPhotos = [];
        updatePreview();

        // Reset dynamic city rows
        const rows = cityTwoWrapper?.querySelectorAll(".city-row") || [];
        rows.forEach((row, i) => {
          if (i === 0) {
            const select = row.querySelector("select");
            select.value = "";
            select.disabled = true;
          } else {
            row.remove();
          }
        });
      } else {
        const err = await res.json();
        showError(err.error || "Submission failed");
      }
    } catch (err) {
      console.error("Submit error:", err);
      showError("Network error. Please try again.");
    }
  });
});
