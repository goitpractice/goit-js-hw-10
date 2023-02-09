import { debounce } from 'lodash-es';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import '../css/styles.css';

import { fetchCountriesByName } from './fetch-countries';
const DEBOUNCE_DELAY = 300;
const notificationParams = {
  showOnlyTheLastOne: true,
};

const inputEl = document.getElementById('search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.value = '';
inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

async function onInputChange(ev) {
  const countryName = ev.target.value.trim();

  if (!countryName) {
    clearCountriesList();
    clearCountryInfo();
    return;
  }

  const countries = await fetchCountriesByName(countryName);

  if (countries.length > 10) {
    Notify.info(
      'Too many matches found. Please enter a more specific name.',
      notificationParams
    );
    clearCountriesList();
    clearCountryInfo();
  } else if (countries.length == 0) {
    Notify.failure(
      'Oops, there is no country with that name',
      notificationParams
    );
    clearCountriesList();
    clearCountryInfo();
  } else if (countries.length === 1) {
    clearCountriesList();
    createCountryInfo(countries[0]);
  } else {
    clearCountryInfo();
    createCountriesList(countries);
  }
}

function createCountryInfo(country) {
  console.log(country);
  const languagesList = country.languages.map(lang => lang.name).join(', ');

  countryInfoEl.innerHTML = `
    <h1>
      <img src="${country.flags.png}" alt="Flag of ${country.name}">
      ${country.name}
    </h1>
    <b>Capital: </b>${country.capital}
    <br/>
    <b>Population: </b>${country.population}
    <br/>
    <b>Languages: </b>${languagesList}
    <br/>
  `;
}

function createCountriesList(countries) {
  console.log(countries);

  countryListEl.innerHTML = countries.reduce((htmlStr, country) => {
    htmlStr += `
      <li>
        <figure>
          <img src="${country.flags.png}" alt="Flag of ${country.name}">
          <figcaption>${country.name}</figcaption>
        </figure>
      </li>
    `;

    return htmlStr;
  }, '');
}

function clearCountriesList() {
  countryListEl.innerHTML = '';
}

function clearCountryInfo() {
  countryInfoEl.innerHTML = '';
}
