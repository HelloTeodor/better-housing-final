import {
  Country,
  City,
} from "https://cdn.jsdelivr.net/npm/country-state-city@3.0.4/+esm";
import { showLoader, hideLoader } from "./loader.js";

// -------------------------------------------
// Helper: Fix for iOS/Android dropdown refresh
// -------------------------------------------
function refreshSelect(select) {
  select.style.display = "none";
  void select.offsetHeight; // force repaint
  select.style.display = "block";
}

// ----------------------------------------------------
// COUNTRY/CITY ONE
// ----------------------------------------------------
const country = document.getElementById("country");
const city = document.getElementById("city");

Country.getAllCountries().forEach((c) => {
  country.insertAdjacentHTML(
    "beforeend",
    `<option value="${c.isoCode}">${c.name}</option>`
  );
});
refreshSelect(country);

country.addEventListener("change", () => {
  const cities = City.getCitiesOfCountry(country.value);

  city.innerHTML = `<option value="" disabled selected>Select city</option>`;
  city.disabled = false;

  cities.forEach((ct) => {
    city.insertAdjacentHTML(
      "beforeend",
      `<option value="${ct.name}">${ct.name}</option>`
    );
  });

  refreshSelect(city);
});

// ----------------------------------------------------
// COUNTRY/CITY TWO
// ----------------------------------------------------
const countryTwo = document.getElementById("countryTwo");
const cityTwoWrapper = document.getElementById("cityTwoWrapper");
const addCityTwo = document.getElementById("addCityTwo");

Country.getAllCountries().forEach((c) => {
  countryTwo.insertAdjacentHTML(
    "beforeend",
    `<option value="${c.isoCode}">${c.name}</option>`
  );
});
refreshSelect(countryTwo);

countryTwo.addEventListener("change", () => {
  const cities = City.getCitiesOfCountry(countryTwo.value);

  document.querySelectorAll(".cityTwo").forEach((dropdown) => {
    dropdown.disabled = false;
    dropdown.innerHTML = `<option value="" disabled selected>Select city</option>`;

    cities.forEach((ct) => {
      dropdown.insertAdjacentHTML(
        "beforeend",
        `<option value="${ct.name}">${ct.name}</option>`
      );
    });

    refreshSelect(dropdown);
  });
});

addCityTwo.addEventListener("click", () => {
  if (!countryTwo.value) {
    alert("Please select a country first.");
    return;
  }

  const cities = City.getCitiesOfCountry(countryTwo.value);

  const row = document.createElement("div");
  row.className = "city-row flex items-center gap-2";

  const select = document.createElement("select");
  select.className = "cityTwo border rounded w-50";
  select.name = "alternativeCity";

  select.innerHTML = `<option value="" disabled selected>Select city</option>`;
  cities.forEach((ct) => {
    select.insertAdjacentHTML(
      "beforeend",
      `<option value="${ct.name}">${ct.name}</option>`
    );
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

// ----------------------------------------------------
// Budget input
// ----------------------------------------------------
const budgetInput = document.getElementById("budgetPerMonth");
budgetInput.addEventListener("input", () => {
  let value = budgetInput.value.replace(/[^\d.,]/g, "");
  budgetInput.value = value ? `${value} €` : "";
});

// ----------------------------------------------------
// Form submit
// ----------------------------------------------------
const form = document.getElementById("companyForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  showLoader(); // show loader

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

    if (res.ok) alert("Form submitted successfully!");
    else alert("Error submitting form.");
  } catch (err) {
    console.error(err);
    alert("Network error, please try again.");
  } finally {
    hideLoader(); // hide loader after submit
  }
});
