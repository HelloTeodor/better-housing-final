import {
  Country,
  City,
} from "https://cdn.jsdelivr.net/npm/country-state-city@3.0.4/+esm";

const country = document.getElementById("country");
const city = document.getElementById("city");

Country.getAllCountries().forEach((c) => {
  country.insertAdjacentHTML(
    "beforeend",
    `<option value="${c.isoCode}">${c.name}</option>`
  );
});

country.addEventListener("change", () => {
  city.innerHTML = "";
  city.disabled = false;
  City.getCitiesOfCountry(country.value).forEach((ct) => {
    city.insertAdjacentHTML("beforeend", `<option>${ct.name}</option>`);
  });
});
