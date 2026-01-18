// /src/forms.js
// iOS-safe version — fixes disabled <select> re-enable bug

import { showLoader, hideLoader } from "./loader.js";

/* iOS redraw helper */
function refreshSelect(select) {
  try {
    select.style.display = "none";
    void select.offsetHeight;
    select.style.display = "";
  } catch (err) {
    // silent
  }
}

/* helper to create <option> */
function makeOption(value, text, disabled = false, selected = false) {
  const o = document.createElement("option");
  o.value = value;
  o.textContent = text;
  if (disabled) o.disabled = true;
  if (selected) o.selected = true;
  return o;
}

async function initForm() {
  const countryEl = document.getElementById("country");
  const cityEl = document.getElementById("city");
  const countryTwo = document.getElementById("countryTwo");
  const cityTwoWrapper = document.getElementById("cityTwoWrapper");
  const addCityTwo = document.getElementById("addCityTwo");
  const budgetInput = document.getElementById("budgetPerMonth");
  const form = document.getElementById("companyForm");

  if (
    !countryEl ||
    !cityEl ||
    !countryTwo ||
    !cityTwoWrapper ||
    !addCityTwo ||
    !form
  ) {
    console.error("forms.js: missing expected DOM elements.");
    return;
  }

  // ---- load country/state/city lib
  let Country, City;
  try {
    const module =
      await import("https://cdn.jsdelivr.net/npm/country-state-city@3.0.4/+esm");
    Country = module.Country;
    City = module.City;
  } catch (err) {
    console.error("Failed to load country-state-city lib", err);
    alert("Failed to load country data.");
    return;
  }

  // ---------- Populate main country
  try {
    const countries = Country.getAllCountries() || [];
    const frag = document.createDocumentFragment();
    frag.appendChild(makeOption("", "Select country", true, true));
    countries.forEach((c) => frag.appendChild(makeOption(c.isoCode, c.name)));
    countryEl.innerHTML = "";
    countryEl.appendChild(frag);
    refreshSelect(countryEl);
  } catch (err) {
    console.error("Error populating country", err);
  }

  // ---------- Main country → city
  countryEl.addEventListener("change", () => {
    try {
      const iso = countryEl.value;
      const cities = City.getCitiesOfCountry(iso) || [];

      // IMPORTANT: iOS-safe enable
      cityEl.removeAttribute("disabled");

      cityEl.innerHTML = "";
      cityEl.appendChild(makeOption("", "Select city", true, true));

      const frag = document.createDocumentFragment();
      cities.forEach((ct) => frag.appendChild(makeOption(ct.name, ct.name)));
      cityEl.appendChild(frag);
      refreshSelect(cityEl);
    } catch (err) {
      console.error("Error populating cities", err);
    }
  });

  // ---------- Populate preferred country
  try {
    const countries2 = Country.getAllCountries() || [];
    const frag2 = document.createDocumentFragment();
    frag2.appendChild(makeOption("", "Select country", true, true));
    countries2.forEach((c) => frag2.appendChild(makeOption(c.isoCode, c.name)));
    countryTwo.innerHTML = "";
    countryTwo.appendChild(frag2);
    refreshSelect(countryTwo);
  } catch (err) {
    console.error("Error populating countryTwo", err);
  }

  // ---------- Preferred country → all cityTwo selects
  countryTwo.addEventListener("change", () => {
    try {
      const iso = countryTwo.value;
      const cities = City.getCitiesOfCountry(iso) || [];

      const allCityTwo = cityTwoWrapper.querySelectorAll(".cityTwo");
      allCityTwo.forEach((dropdown) => {
        // IMPORTANT: iOS-safe enable
        dropdown.removeAttribute("disabled");

        dropdown.innerHTML = "";
        dropdown.appendChild(makeOption("", "Select city", true, true));

        const frag = document.createDocumentFragment();
        cities.forEach((ct) => frag.appendChild(makeOption(ct.name, ct.name)));
        dropdown.appendChild(frag);
        refreshSelect(dropdown);
      });
    } catch (err) {
      console.error("Error populating preferred cities", err);
    }
  });

  // ---------- Add another preferred city
  addCityTwo.addEventListener("click", () => {
    try {
      if (!countryTwo.value) {
        alert("Please select a country first.");
        return;
      }

      const cities = City.getCitiesOfCountry(countryTwo.value) || [];

      const row = document.createElement("div");
      row.className = "city-row flex items-center gap-2";

      const select = document.createElement("select");
      select.className = "cityTwo border rounded w-full md:w-1/2";
      select.name = "preferredCity";
      // NOTE: do NOT set disabled at all (iOS-safe)

      select.appendChild(makeOption("", "Select city", true, true));
      const frag = document.createDocumentFragment();
      cities.forEach((ct) => frag.appendChild(makeOption(ct.name, ct.name)));
      select.appendChild(frag);
      refreshSelect(select);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "✕";
      removeBtn.className =
        "px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600";
      removeBtn.addEventListener("click", () => row.remove());

      row.appendChild(select);
      row.appendChild(removeBtn);
      cityTwoWrapper.appendChild(row);
    } catch (err) {
      console.error("Error adding city row", err);
    }
  });

  // ---------- Budget formatting
  if (budgetInput) {
    budgetInput.addEventListener("input", () => {
      let value = budgetInput.value.replace(/[^\d.,]/g, "");
      budgetInput.value = value ? `${value} €` : "";
    });
  }

  // ---------- Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoader();

    const formData = new FormData(e.target);
    const data = {};
    formData.forEach((value, key) => {
      if (data[key]) {
        if (!Array.isArray(data[key])) data[key] = [data[key]];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      alert(res.ok ? "Form submitted successfully!" : "Error submitting form.");
    } catch (err) {
      console.error("Submit error", err);
      alert("Network error.");
    } finally {
      hideLoader();
    }
  });

  console.log("forms.js: init completed.");
}

// ---- init
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initForm);
} else {
  initForm();
}
