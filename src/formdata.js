import { showLoader, showSuccess, showError } from "./loader.js";

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

    // 👇 SHOW LOADING STATE
    showLoader("Sending...");

    const formData = new FormData(form);
    const data = {};

    // Convert FormData to object
    formData.forEach((value, key) => {
      if (data[key]) {
        if (!Array.isArray(data[key])) data[key] = [data[key]];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });

    // ---------- COUNTRY FULL NAMES ----------
    const countrySelect = document.getElementById("country");
    if (countrySelect && data.country) {
      data.country = countrySelect.options[countrySelect.selectedIndex].text;
    }

    const countryTwoSelect = document.getElementById("countryTwo");
    if (countryTwoSelect && data.preferredCountry) {
      data.preferredCountry =
        countryTwoSelect.options[countryTwoSelect.selectedIndex].text;
    }

    // ---------- KEEP DATES AS STRINGS ----------
    data.fromDate = data.fromDate || "";
    data.toDate = data.toDate || "";

    // ---------- PREFERRED CITIES ----------
    const cityTwoWrapper = document.getElementById("cityTwoWrapper");
    data.preferredCity = [];
    cityTwoWrapper
      ?.querySelectorAll(".cityTwo")
      .forEach((sel) => sel.value && data.preferredCity.push(sel.value));

    // ---------- SEND ----------
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        // ✅ SUCCESS STATE
        showSuccess("Form submitted successfully!");

        form.reset();

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
