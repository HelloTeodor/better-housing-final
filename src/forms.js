// /src/forms.js
// Robust iOS-friendly version — dynamic import + safe DOM ops

import { showLoader, hideLoader } from "./loader.js";

/* iOS redraw helper */
function refreshSelect(select) {
  // Force a reflow to help iOS render the native select popup correctly
  try {
    select.style.display = "none";
    void select.offsetHeight;
    select.style.display = "";
  } catch (err) {
    // silent
  }
}

/* small helper to create an <option> element */
function makeOption(value, text, disabled = false, selected = false) {
  const o = document.createElement("option");
  o.value = value;
  o.textContent = text;
  if (disabled) o.disabled = true;
  if (selected) o.selected = true;
  return o;
}

/* main init wrapped so we can await dynamic import and catch errors */
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
    console.error("forms.js: missing expected DOM elements. Aborting init.");
    return;
  }

  // Dynamic import of the country-state-city lib (improves iOS compatibility)
  let Country, City;
  try {
    const module = await import(
      "https://cdn.jsdelivr.net/npm/country-state-city@3.0.4/+esm"
    );
    Country = module.Country;
    City = module.City;
    console.log(
      "forms.js: loaded country-state-city library",
      Country && City ? "OK" : "NO"
    );
  } catch (err) {
    console.error("forms.js: Failed to load country-state-city library:", err);
    // Provide a visible fallback so you notice on mobile
    alert(
      "Country data failed to load. Please try again or open devtools for details."
    );
    return;
  }

  // ---------- Populate countries (use DocumentFragment)
  try {
    const countries = Country.getAllCountries() || [];
    console.log("forms.js: countries count:", countries.length);

    // If countries is empty — log & warn
    if (!countries.length) {
      console.warn("forms.js: Country.getAllCountries() returned empty list.");
    }

    // Build fragment for countryEl
    const frag = document.createDocumentFragment();
    frag.appendChild(makeOption("", "Select country", true, true)); // placeholder

    countries.forEach((c) => {
      const opt = makeOption(c.isoCode, c.name);
      frag.appendChild(opt);
    });

    // Clear any existing children and append fragment
    countryEl.innerHTML = "";
    countryEl.appendChild(frag);
    refreshSelect(countryEl);
  } catch (err) {
    console.error("forms.js: error populating country select:", err);
  }

  // ---------- When primary country changes, populate primary city
  countryEl.addEventListener("change", () => {
    try {
      const iso = countryEl.value;
      const cities = City.getCitiesOfCountry(iso) || [];
      console.log(
        "forms.js: primary country changed to",
        iso,
        "cities:",
        cities.length
      );

      cityEl.disabled = false;
      cityEl.innerHTML = "";
      cityEl.appendChild(makeOption("", "Select city", true, true));

      // append via fragment
      const frag = document.createDocumentFragment();
      cities.forEach((ct) => {
        frag.appendChild(makeOption(ct.name, ct.name));
      });
      cityEl.appendChild(frag);
      refreshSelect(cityEl);
    } catch (err) {
      console.error("forms.js: error populating primary cities:", err);
    }
  });

  // ---------- Populate countries for countryTwo (preferred)
  try {
    const countries2 = Country.getAllCountries() || [];
    const frag2 = document.createDocumentFragment();
    frag2.appendChild(makeOption("", "Select country", true, true));
    countries2.forEach((c) => frag2.appendChild(makeOption(c.isoCode, c.name)));
    countryTwo.innerHTML = "";
    countryTwo.appendChild(frag2);
    refreshSelect(countryTwo);
  } catch (err) {
    console.error("forms.js: error populating countryTwo:", err);
  }

  // When countryTwo changes — update all existing .cityTwo selects
  countryTwo.addEventListener("change", () => {
    try {
      const iso = countryTwo.value;
      const cities = City.getCitiesOfCountry(iso) || [];
      console.log(
        "forms.js: countryTwo changed to",
        iso,
        "cities:",
        cities.length
      );

      // find all selects with class .cityTwo (initial + added)
      const allCityTwo = cityTwoWrapper.querySelectorAll(".cityTwo");
      allCityTwo.forEach((dropdown) => {
        dropdown.disabled = false;
        dropdown.innerHTML = "";
        dropdown.appendChild(makeOption("", "Select city", true, true));

        const frag = document.createDocumentFragment();
        cities.forEach((ct) => frag.appendChild(makeOption(ct.name, ct.name)));
        dropdown.appendChild(frag);
        refreshSelect(dropdown);
      });
    } catch (err) {
      console.error("forms.js: error populating countryTwo cities:", err);
    }
  });

  // Add another city for preferred country
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
      select.disabled = false;

      // placeholder + options
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
      console.error("forms.js: error adding additional city row:", err);
    }
  });

  // ---------- Budget input formatting (keeps euro symbol)
  if (budgetInput) {
    budgetInput.addEventListener("input", () => {
      let value = budgetInput.value.replace(/[^\d.,]/g, "");
      budgetInput.value = value ? `${value} €` : "";
    });
  }

  // ---------- Form submit (collects arrays for repeated names)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoader();

    const formData = new FormData(e.target);
    const data = {};
    formData.forEach((value, key) => {
      // If same field appears multiple times, turn into array
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

      if (res.ok) {
        alert("Form submitted successfully!");
      } else {
        alert("Error submitting form.");
      }
    } catch (err) {
      console.error("forms.js: submit error:", err);
      alert("Network error, please try again.");
    } finally {
      hideLoader();
    }
  });

  // Final sanity logs
  console.log("forms.js: init completed.");
}

// Launch after DOM loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initForm);
} else {
  initForm();
}
