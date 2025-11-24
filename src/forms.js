import {
  Country,
  City,
} from "https://cdn.jsdelivr.net/npm/country-state-city@3.0.4/+esm";
import { showLoader, hideLoader, showMessage } from "./loader.js";

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
  });
});

addCityTwo.addEventListener("click", () => {
  if (!countryTwo.value) {
    showMessage("Please select a country first.", false);
    return;
  }

  const cities = City.getCitiesOfCountry(countryTwo.value);
  const row = document.createElement("div");
  row.className = "city-row flex items-center gap-2";

  const select = document.createElement("select");
  select.className = "cityTwo border rounded w-full"; // full width for mobile
  select.name = "alternativeCity";
  select.innerHTML = `<option value="" disabled selected>Select city</option>`;
  cities.forEach((ct) => {
    select.insertAdjacentHTML(
      "beforeend",
      `<option value="${ct.name}">${ct.name}</option>`
    );
  });

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
  const value = budgetInput.value.replace(/[^\d.,]/g, "");
  budgetInput.value = value ? `${value} €` : "";
});

// ----------------------------------------------------
// Form submit
// ----------------------------------------------------
const form = document.getElementById("companyForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  showLoader();

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

  try {
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Server error");

    showMessage("Form submitted successfully!");
    form.reset(); // reset form after success
  } catch (err) {
    console.error(err);
    showMessage("Error submitting form. Check your connection.", false);
  } finally {
    hideLoader();
  }
});
