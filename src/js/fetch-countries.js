const baseUrl = 'https://restcountries.com/v2';
const dataFields = ['name', 'altSpellings', 'capital', 'population', 'flags', 'languages'];

export async function fetchCountriesByName(name) {
  const url = `${baseUrl}/name/${name}`;
  const searchParams = new URLSearchParams({
    fields: dataFields.join(','),
  });

  const countries = await fetch(url + '?' + searchParams);
  const countriesList = await countries.json();

  return Array.isArray(countriesList) ? countriesList : [];
}
