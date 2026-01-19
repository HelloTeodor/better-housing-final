// country-city.js
// Uses countrystatecity.in API
// Works with iOS Safari

const API_KEY =
  "b456c8da5a0b2e0dee73313a7436bc4643649cdbcc13ca187f6f1e79a0d6cd37";
const BASE_URL = "https://api.countrystatecity.in/v1";

/* ---------- Helpers ---------- */

async function apiFetch(url) {
  const res = await fetch(url, {
    headers: {
      "X-CSCAPI-KEY": API_KEY,
    },
  });
  if (!res.ok) throw new Error("API request failed");
  return res.json();
}

function createOption(value, text) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = text;
  return opt;
}

/* ---------- DOM Ready ---------- */

document.addEventListener("DOMContentLoaded", initCountryCity);

async function initCountryCity() {
  const country = document.getElementById("country");
  const city = document.getElementById("city");

  const countryTwo = document.getElementById("countryTwo");
  const cityTwoWrapper = document.getElementById("cityTwoWrapper");
  const addCityTwo = document.getElementById("addCityTwo");

  if (!country || !city || !countryTwo || !cityTwoWrapper || !addCityTwo) {
    console.error("Country/City elements missing");
    return;
  }

  try {
    const countries = await apiFetch(`${BASE_URL}/countries`);

    // Populate both country selects
    countries.forEach((c) => {
      country.appendChild(createOption(c.iso2, c.name));
      countryTwo.appendChild(createOption(c.iso2, c.name));
    });
  } catch (err) {
    console.error("Failed to load countries", err);
    alert("Failed to load countries");
  }

  /* ---------- Primary country → city ---------- */

  country.addEventListener("change", async () => {
    city.innerHTML = `<option value="">Select city</option>`;
    city.disabled = true;

    if (!country.value) return;

    try {
      const cities = await apiFetch(
        `${BASE_URL}/countries/${country.value}/cities`,
      );

      cities.forEach((ct) => {
        city.appendChild(createOption(ct.name, ct.name));
      });

      city.disabled = false;
    } catch (err) {
      console.error("Failed to load cities", err);
      alert("Failed to load cities");
    }
  });

  /* ---------- Preferred country → all preferred cities ---------- */

  countryTwo.addEventListener("change", async () => {
    const iso = countryTwo.value;
    const citySelects = cityTwoWrapper.querySelectorAll(".cityTwo");

    citySelects.forEach((sel) => {
      sel.innerHTML = `<option value="">Select city</option>`;
      sel.disabled = true;
    });

    if (!iso) return;

    try {
      const cities = await apiFetch(`${BASE_URL}/countries/${iso}/cities`);

      citySelects.forEach((sel) => {
        cities.forEach((ct) => {
          sel.appendChild(createOption(ct.name, ct.name));
        });
        sel.disabled = false;
      });
    } catch (err) {
      console.error("Failed to load preferred cities", err);
      alert("Failed to load cities");
    }
  });

  /* ---------- Add another preferred city ---------- */

  addCityTwo.addEventListener("click", async () => {
    if (!countryTwo.value) {
      alert("Please select a country first.");
      return;
    }

    const row = document.createElement("div");
    row.className = "city-row flex items-center gap-2";

    const select = document.createElement("select");
    select.className = "cityTwo border rounded w-50";
    select.name = "preferredCity";

    select.appendChild(createOption("", "Select city"));

    try {
      const cities = await apiFetch(
        `${BASE_URL}/countries/${countryTwo.value}/cities`,
      );

      cities.forEach((ct) => {
        select.appendChild(createOption(ct.name, ct.name));
      });

      select.disabled = false;
    } catch (err) {
      console.error("Failed to load cities", err);
      alert("Failed to load cities");
      return;
    }

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
