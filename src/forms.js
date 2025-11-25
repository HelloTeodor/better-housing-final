// /src/forms.js
import {
  Country,
  City,
} from "https://cdn.jsdelivr.net/npm/country-state-city@3.0.4/+esm";
import { showLoader, hideLoader } from "./loader.js";

/* iOS redraw helper */
function refreshSelect(select) {
  // force a reflow so iOS redraws the select popup properly
  select.style.display = "none";
  void select.offsetHeight;
  select.style.display = "";
}

/* COUNTRY / CITY ONE */
const country = document.getElementById("country");
const city = document.getElementById("city");

if (!country || !city) {
  console.error("Country or city element missing from DOM");
} else {
  // Populate countries
  Country.getAllCountries().forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.isoCode;
    opt.textContent = c.name;
    country.appendChild(opt);
  });
  refreshSelect(country);

  country.addEventListener("change", () => {
    const cities = City.getCitiesOfCountry(country.value) || [];
    city.innerHTML = "";
    city.disabled = false;

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select city";
    city.appendChild(placeholder);

    cities.forEach((ct) => {
      const opt = document.createElement("option");
      opt.value = ct.name;
      opt.textContent = ct.name;
      city.appendChild(opt);
    });

    refreshSelect(city);
  });
}

/* COUNTRY / CITY TWO (multiple preferred cities) */
const countryTwo = document.getElementById("countryTwo");
const cityTwoWrapper = document.getElementById("cityTwoWrapper");
const addCityTwo = document.getElementById("addCityTwo");

if (!countryTwo || !cityTwoWrapper || !addCityTwo) {
  console.error("countryTwo or cityTwoWrapper or addCityTwo missing");
} else {
  // Populate countries
  Country.getAllCountries().forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.isoCode;
    opt.textContent = c.name;
    countryTwo.appendChild(opt);
  });
  refreshSelect(countryTwo);

  countryTwo.addEventListener("change", () => {
    const cities = City.getCitiesOfCountry(countryTwo.value) || [];
    // update every existing .cityTwo dropdown (including the initial one)
    document.querySelectorAll(".cityTwo").forEach((dropdown) => {
      dropdown.disabled = false;
      dropdown.innerHTML = "";
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Select city";
      dropdown.appendChild(placeholder);

      cities.forEach((ct) => {
        const opt = document.createElement("option");
        opt.value = ct.name;
        opt.textContent = ct.name;
        dropdown.appendChild(opt);
      });

      refreshSelect(dropdown);
    });
  });

  addCityTwo.addEventListener("click", () => {
    if (!countryTwo.value) {
      alert("Please select a country first.");
      return;
    }

    const cities = City.getCitiesOfCountry(countryTwo.value) || [];

    const row = document.createElement("div");
    row.className = "city-row flex items-center gap-2";

    const select = document.createElement("select");
    select.className = "cityTwo border rounded w-full md:w-1/2";
    // Use same name as initial field so multiple FormData values are created
    select.name = "preferredCity";
    select.disabled = false;

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select city";
    select.appendChild(placeholder);

    cities.forEach((ct) => {
      const opt = document.createElement("option");
      opt.value = ct.name;
      opt.textContent = ct.name;
      select.appendChild(opt);
    });

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
  });
}

/* Budget input formatting */
const budgetInput = document.getElementById("budgetPerMonth");
if (budgetInput) {
  budgetInput.addEventListener("input", () => {
    let value = budgetInput.value.replace(/[^\d.,]/g, "");
    budgetInput.value = value ? `${value} €` : "";
  });
}

/* Form submit */
const form = document.getElementById("companyForm");
if (!form) {
  console.error("No form with id companyForm found.");
} else {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoader();

    const formData = new FormData(e.target);
    const data = {};

    formData.forEach((value, key) => {
      // If same field occurs multiple times, convert to array
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
        // optionally reset form here: form.reset();
      } else {
        alert("Error submitting form.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error, please try again.");
    } finally {
      hideLoader();
    }
  });
}
