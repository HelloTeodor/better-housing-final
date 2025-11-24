import {
  Country,
  City,
} from "https://cdn.jsdelivr.net/npm/country-state-city@3.0.4/+esm";

// ------------------------
// COUNTRY/CITY ONE (mobile safe)
// ------------------------
const country = document.getElementById("country");
const city = document.getElementById("city");

Country.getAllCountries().forEach((c) => {
  const opt = document.createElement("option");
  opt.value = c.isoCode;
  opt.textContent = c.name;
  country.appendChild(opt);
});

country.addEventListener("change", () => {
  city.innerHTML = "";
  city.disabled = false;

  const def = document.createElement("option");
  def.value = "";
  def.textContent = "Select city";
  def.disabled = true;
  def.selected = true;
  city.appendChild(def);

  City.getCitiesOfCountry(country.value).forEach((ct) => {
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
  if (!countryTwo.value) return alert("Please select a country first.");

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

  const remove = document.createElement("button");
  remove.type = "button";
  remove.textContent = "✕";
  remove.className = "px-2 py-1 bg-red-500 text-white rounded";

  remove.addEventListener("click", () => row.remove());

  row.appendChild(select);
  row.appendChild(remove);
  cityTwoWrapper.appendChild(row);
});

// ------------------------
// Budget input with euro
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

  const form = document.getElementById("companyForm");
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

  // TAKE SCREENSHOT CLEAN (remove oklch)
  const canvas = await html2canvas(form, {
    scale: 2,
    useCORS: true,
    onclone(doc) {
      doc.querySelectorAll("*").forEach((el) => {
        const s = doc.defaultView.getComputedStyle(el);
        if (s.color.includes("oklch")) el.style.color = "rgb(0,0,0)";
        if (s.backgroundColor.includes("oklch"))
          el.style.backgroundColor = "rgb(255,255,255)";
      });
    },
  });

  const base64Full = canvas.toDataURL("image/png");

  // REMOVE PREFIX → SHORTER IN MONGODB
  const cleanBase64 = base64Full.replace(/^data:image\/png;base64,/, "");

  data.screenshot = cleanBase64;

  // SEND TO SERVER
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
    alert("Network error, try again.");
  }
});
