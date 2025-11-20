import {
  Country,
  City,
} from "https://cdn.jsdelivr.net/npm/country-state-city@3.0.4/+esm";

// ------------------------
// COUNTRY/CITY ONE
// ------------------------
const country = document.getElementById("country");
const city = document.getElementById("city");

// Populate first country dropdown
Country.getAllCountries().forEach((c) => {
  country.insertAdjacentHTML(
    "beforeend",
    `<option value="${c.isoCode}">${c.name}</option>`
  );
});

// Update city dropdown on first country change
country.addEventListener("change", () => {
  city.innerHTML = "<option value='' disabled selected>Select city</option>";
  city.disabled = false;

  const cities = City.getCitiesOfCountry(country.value);
  cities.forEach((ct) => {
    city.insertAdjacentHTML(
      "beforeend",
      `<option value="${ct.name}">${ct.name}</option>`
    );
  });
});

// ------------------------
// COUNTRY/CITY TWO (your working code, untouched)
// ------------------------
const countryTwo = document.getElementById("countryTwo");
const cityTwoWrapper = document.getElementById("cityTwoWrapper");
const addCityTwo = document.getElementById("addCityTwo");

// Populate countries for countryTwo
Country.getAllCountries().forEach((c) => {
  countryTwo.insertAdjacentHTML(
    "beforeend",
    `<option value="${c.isoCode}">${c.name}</option>`
  );
});

// Update all cityTwo dropdowns when countryTwo changes
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

// Add new city row for countryTwo
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
  select.name = "cityTwo[]";

  select.innerHTML = `<option value="" disabled selected>Select city</option>`;
  cities.forEach((ct) => {
    select.insertAdjacentHTML(
      "beforeend",
      `<option value="${ct.name}">${ct.name}</option>`
    );
  });

  // Remove button
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "✕";
  removeBtn.className =
    "px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600";

  removeBtn.addEventListener("click", () => {
    row.remove();
  });

  row.appendChild(select);
  row.appendChild(removeBtn);

  cityTwoWrapper.appendChild(row);
});

// ------------------------
// Budget input with euro symbol
// ------------------------
const budgetInput = document.getElementById("budgetPerMonth");

budgetInput.addEventListener("input", () => {
  let value = budgetInput.value;

  // Remove non-digit characters (except dot or comma)
  value = value.replace(/[^\d.,]/g, "");
  // Add euro symbol
  if (value) {
    budgetInput.value = `${value} €`;
  } else {
    budgetInput.value = "";
  }
});

// Handle form submit
document.getElementById("companyForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent page reload

  const formData = new FormData(e.target);
  const data = {};

  formData.forEach((value, key) => {
    // If field already exists, turn into array
    if (data[key]) {
      if (!Array.isArray(data[key])) {
        data[key] = [data[key]]; // convert first value into array
      }
      data[key].push(value); // add additional values
    } else {
      data[key] = value; // first value
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
  }
});
