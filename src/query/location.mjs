///////////////////////////////////////////////////////////////////////////////
// location ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
 
// imports - local modules ////////////////////////////////////////////////////
import { acPrompt, strPrompt } from '../prompts/index.mjs';
import countries from '../../data/countries.mjs';
import usStates from '../../data/usStates.mjs';
import cities from '../../data/cities.mjs';


// location - country /////////////////////////////////////////////////////////
const getCountry = async () => {
  const countriesArr = countries.map(({ name }) => name);
  return await acPrompt('Pick country', countriesArr, 'United States');
};

// location - usState /////////////////////////////////////////////////////////
const getUSState = async () => {
  const usStatesArr = usStates.map(({ name }) => name).sort();
  const usState = await acPrompt('Pick a US State', usStatesArr);
  return `${usState}--`
}

// location - city ////////////////////////////////////////////////////////////

const getCity = async country => {
  const countryCode = countries.find(({ name }) => (name === country)).code;
  const citiesArr = cities
    .filter(({ country: pickedCountry }) => pickedCountry === countryCode)
    .map(({ name }) => name)
    .sort();
  return await acPrompt(`Pick a city in ${country}`, citiesArr);
};

// location - neighborhood ////////////////////////////////////////////////////
const getNeighborhood = async () => {
  const neighborhood = await strPrompt('Enter a neighborhood (OPTIONAL)')
  return neighborhood ? `${neighborhood}--` : '';
};

// location  //////////////////////////////////////////////////////////////////
/**
 * Constructs location string
 * @param {string} neighborhood
 * @param {string} city
 * @param {string} usState
 * @param {string} country
 * @returns {string} location (hyphenated)
 */
const getLocation = (neighborhood, city, usState = '', country) => (
  `${neighborhood}${city}--${usState}${country}`
    .replaceAll(' ', '-')
);

export {
  getCountry,
  getUSState,
  getCity,
  getNeighborhood,
  getLocation,
};
