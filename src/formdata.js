import { showLoader, hideLoader } from "./loader.js";
import { showPopup } from "./popup.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("companyForm");
  if (!form) return;

  // ---------- FLATPICKR ----------
  flatpickr("#fromDate", {
    dateFormat: "d/m/Y",
    allowInput: true,
  });

  flatpickr("#toDate", {
    dateFormat: "d/m/Y",
    allowInput: true,
  });

  // ---------- SUBMIT ----------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    showLoader(); // 👈 START LOADER

    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
      if (data[key]) {
        if (!Array.isArray(data[key])) data[key] = [data[key]];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });

    // Country full name
    const countrySelect = document.getElementById("country");
    if (countrySelect && data.country) {
      data.country = countrySelect.options[countrySelect.selectedIndex].text;
    }

    const countryTwoSelect = document.getElementById("countryTwo");
    if (countryTwoSelect && data.preferredCountry) {
      data.preferredCountry =
        countryTwoSelect.options[countryTwoSelect.selectedIndex].text;
    }

    // Dates stay as strings
    data.fromDate = data.fromDate || "";
    data.toDate = data.toDate || "";

    // Preferred cities
    const cityTwoWrapper = document.getElementById("cityTwoWrapper");
    data.preferredCity = [];
    cityTwoWrapper
      ?.querySelectorAll(".cityTwo")
      .forEach((sel) => sel.value && data.preferredCity.push(sel.value));

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      hideLoader(); // 👈 STOP LOADER

      if (res.ok) {
        showPopup("Form submitted successfully!", "success");

        form.reset();

        // Reset dynamic city rows
        const rows = cityTwoWrapper.querySelectorAll(".city-row");
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
        showPopup(err.error || "Submission failed", "error");
      }
    } catch (err) {
      console.error(err);
      hideLoader();
      showPopup("Network error. Please try again.", "error");
    }
  });
});
