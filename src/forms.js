import {
  Country,
  City,
} from "https://cdn.jsdelivr.net/npm/country-state-city@3.0.4/+esm";

// ------------------------
// COUNTRY/CITY ONE (fixed for mobile)
// ------------------------
const country = document.getElementById("country");
const city = document.getElementById("city");

// Populate first country dropdown
Country.getAllCountries().forEach((c) => {
  const opt = document.createElement("option");
  opt.value = c.isoCode;
  opt.textContent = c.name;
  country.appendChild(opt);
});

// Update city dropdown on first country change
country.addEventListener("change", () => {
  city.innerHTML = "";
  city.disabled = false;

  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "Select city";
  defaultOpt.disabled = true;
  defaultOpt.selected = true;
  city.appendChild(defaultOpt);

  const cities = City.getCitiesOfCountry(country.value);
  cities.forEach((ct) => {
    const opt = document.createElement("option");
    opt.value = ct.name;
    opt.textContent = ct.name;
    city.appendChild(opt);
  });
});

// ------------------------
// COUNTRY/CITY TWO
// ------------------------
const countryTwo = document.getElementById("countryTwo");
const cityTwoWrapper = document.getElementById("cityTwoWrapper");
const addCityTwo = document.getElementById("addCityTwo");

Country.getAllCountries().forEach((c) => {
  const opt = document.createElement("option");
  opt.value = c.isoCode;
  opt.textContent = c.name;
  countryTwo.appendChild(opt);
});

countryTwo.addEventListener("change", () => {
  const cities = City.getCitiesOfCountry(countryTwo.value);

  document.querySelectorAll(".cityTwo").forEach((dropdown) => {
    dropdown.disabled = false;
    dropdown.innerHTML = "";

    const def = document.createElement("option");
    def.value = "";
    def.textContent = "Select city";
    def.disabled = true;
    def.selected = true;
    dropdown.appendChild(def);

    cities.forEach((ct) => {
      const opt = document.createElement("option");
      opt.value = ct.name;
      opt.textContent = ct.name;
      dropdown.appendChild(opt);
    });
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

  const def = document.createElement("option");
  def.value = "";
  def.textContent = "Select city";
  def.disabled = true;
  def.selected = true;
  select.appendChild(def);

  cities.forEach((ct) => {
    const opt = document.createElement("option");
    opt.value = ct.name;
    opt.textContent = ct.name;
    select.appendChild(opt);
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

// ------------------------
// Budget input with euro symbol
// ------------------------
const budgetInput = document.getElementById("budgetPerMonth");

budgetInput.addEventListener("input", () => {
  let value = budgetInput.value.replace(/[^\d.,]/g, "");
  budgetInput.value = value ? `${value} €` : "";
});

// ------------------------
// FORM SUBMIT + SCREENSHOT
// ------------------------
document.getElementById("companyForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formElement = document.getElementById("companyForm");

  // Convert formData to object (handles duplicates)
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

  // --------------------
  // TAKE SCREENSHOT HERE
  // --------------------
  const canvas = await html2canvas(formElement, {
    scale: 2,
    useCORS: true,
  });

  const screenshotBase64 = canvas.toDataURL("image/png");
  data.screenshot = screenshotBase64; // attach screenshot to MongoDB document

  // --------------------
  // SEND TO SERVER
  // --------------------
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
