// formdata.js
import { showLoader, hideLoader } from "./loader.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("companyForm");
  if (!form) return;

  // ---------- FLATPICKR DATE PICKER ----------
  flatpickr("#fromDate", {
    dateFormat: "d/m/Y",
    allowInput: true,
  });

  flatpickr("#toDate", {
    dateFormat: "d/m/Y",
    allowInput: true,
  });

  // ---------- FORM SUBMISSION ----------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    showLoader(); // 🔵 SHOW LOADER IMMEDIATELY

    const formData = new FormData(form);
    const data = {};

    // Convert FormData → object
    formData.forEach((value, key) => {
      if (data[key]) {
        if (!Array.isArray(data[key])) data[key] = [data[key]];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });

    // ---------- FULL COUNTRY NAMES ----------
    const countrySelect = document.getElementById("country");
    if (countrySelect && data.country) {
      data.country = countrySelect.options[countrySelect.selectedIndex].text;
    }

    const countryTwoSelect = document.getElementById("countryTwo");
    if (countryTwoSelect && data.preferredCountry) {
      data.preferredCountry =
        countryTwoSelect.options[countryTwoSelect.selectedIndex].text;
    }

    // ---------- KEEP DATES AS STRING ----------
    data.fromDate = data.fromDate || "";
    data.toDate = data.toDate || "";

    // ---------- MULTIPLE PREFERRED CITIES ----------
    const cityTwoWrapper = document.getElementById("cityTwoWrapper");
    if (cityTwoWrapper) {
      const citySelects = cityTwoWrapper.querySelectorAll(".cityTwo");
      data.preferredCity = [];
      citySelects.forEach((sel) => {
        if (sel.value) data.preferredCity.push(sel.value);
      });
    }

    // ---------- SEND ----------
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }

      // ✅ SUCCESS
      form.reset();

      // Reset dynamic city selects
      if (cityTwoWrapper) {
        const cityRows = cityTwoWrapper.querySelectorAll(".city-row");
        cityRows.forEach((row, idx) => {
          if (idx === 0) {
            const select = row.querySelector("select");
            select.value = "";
            select.disabled = true;
          } else {
            row.remove();
          }
        });
      }
    } catch (err) {
      console.error("Form submission error:", err);
      alert(err.message || "Network error");
    } finally {
      hideLoader(); // 🔵 ALWAYS HIDE LOADER
    }
  });
});
