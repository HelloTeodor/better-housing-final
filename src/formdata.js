// formdata.js

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("companyForm");
  if (!form) return;

  // ---------- FLATPICKR DATE PICKER ----------
  flatpickr("#fromDate", {
    dateFormat: "d/m/Y", // dd/mm/yyyy
    allowInput: true,
  });

  flatpickr("#toDate", {
    dateFormat: "d/m/Y",
    allowInput: true,
  });

  // ---------- FORM SUBMISSION ----------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};

    // Convert FormData into plain object
    formData.forEach((value, key) => {
      if (data[key]) {
        if (!Array.isArray(data[key])) data[key] = [data[key]];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });

    // ---------- REPLACE COUNTRY ISO WITH FULL NAME ----------
    const countrySelect = document.getElementById("country");
    if (countrySelect && data.country) {
      data.country = countrySelect.options[countrySelect.selectedIndex].text;
    }

    const countryTwoSelect = document.getElementById("countryTwo");
    if (countryTwoSelect && data.preferredCountry) {
      data.preferredCountry =
        countryTwoSelect.options[countryTwoSelect.selectedIndex].text;
    }

    // ---------- CONVERT DATES TO ISO ----------
    if (data.fromDate) {
      const [d, m, y] = data.fromDate.split("/");
      data.fromDate = new Date(`${y}-${m}-${d}`);
    }
    if (data.toDate) {
      const [d, m, y] = data.toDate.split("/");
      data.toDate = new Date(`${y}-${m}-${d}`);
    }

    // ---------- COLLECT MULTIPLE PREFERRED CITIES ----------
    // All selects with class .cityTwo
    const cityTwoWrapper = document.getElementById("cityTwoWrapper");
    if (cityTwoWrapper) {
      const citySelects = cityTwoWrapper.querySelectorAll(".cityTwo");
      data.preferredCity = [];
      citySelects.forEach((sel) => {
        if (sel.value) data.preferredCity.push(sel.value);
      });
    }

    // ---------- SEND TO API ----------
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Form submitted successfully!");
        form.reset();

        // Reset dynamic city selects
        const cityRows = cityTwoWrapper.querySelectorAll(".city-row");
        cityRows.forEach((row, idx) => {
          if (idx === 0) {
            const select = row.querySelector("select");
            select.value = "";
            select.disabled = true;
          } else {
            row.remove(); // remove extra rows
          }
        });
      } else {
        const err = await res.json();
        alert(err.error || "Submission failed");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      alert("Network error, please try again.");
    }
  });
});
