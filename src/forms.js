import {
  Country,
  City,
} from "https://cdn.jsdelivr.net/npm/country-state-city@3.0.4/+esm";

const country = document.getElementById("country");
const city = document.getElementById("city");

// Populate country dropdown
Country.getAllCountries().forEach((c) => {
  country.insertAdjacentHTML(
    "beforeend",
    `<option value="${c.isoCode}">${c.name}</option>`
  );
});

// Populate city dropdown on country change
country.addEventListener("change", () => {
  city.innerHTML = "<option value='' disabled selected>Select city</option>";
  city.disabled = false;
  City.getCitiesOfCountry(country.value).forEach((ct) => {
    city.insertAdjacentHTML(
      "beforeend",
      `<option value="${ct.name}">${ct.name}</option>`
    );
  });
});

// Handle form submit
document.getElementById("companyForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent page reload

  const data = Object.fromEntries(new FormData(e.target).entries());

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
