///////////////////////////////////////////////////////////////////////////////
// location ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// imports //////////////////////////////////////////////////////////////////// 
import { Country, State, City } from 'country-state-city';
// imports - local modules ////////////////////////////////////////////////////
import { acPrompt, strPrompt } from '../prompts/index.mjs';
// import countries from '../../data/countries.mjs';
// import usStates from '../../data/usStates.mjs';
// import cities from '../../data/cities.mjs';


// location - country /////////////////////////////////////////////////////////
const getCountry = async () => {
  const countriesArr = Country.getAllCountries().map(({ name, isoCode }) => (
    `${name} [${isoCode}]`
  ));
  const countryChoice = await acPrompt('Pick country', countriesArr, 'United States [US]');
  const { name: country } = Country.getAllCountries().find(country => (
    country.isoCode === countryChoice.match(/\[(.*)\]/)[1]
  ));
  return country;
};

// location - state ///////////////////////////////////////////////////////////
const getState = async (countryName) => {
  const { isoCode } = Country.getAllCountries().find(country => (
    country.name === countryName
  ));
  const states = State.getStatesOfCountry(isoCode);
  if (!states) return '';

  const statesArr = states
    .filter(({ isoCode }) => (isoCode.length === 2))
    .map(({ name, isoCode }) => `${name} [${isoCode}]`);
  const stateChoice = await acPrompt('Pick a State', statesArr);
  const { name: state } = states.find(state => (
    state.isoCode === stateChoice.match(/\[(.*)\]/)[1]
  ));
  return `${state}--`
}

// location - city ////////////////////////////////////////////////////////////

const getCity = async (countryName, state) => {
  const stateName = state.slice(0, -2);
  const { isoCode: countryCode } = Country.getAllCountries().find(country => (
    country.name === countryName
  ));
  const { isoCode: stateCode } = State.getStatesOfCountry(countryCode)
    .find(state => (state.name === stateName));
  const citiesArr = City.getCitiesOfState(countryCode, stateCode);

  return await acPrompt(
    `Pick a city in ${stateName ? `${stateName} of ` : ''}${countryName}`,
    citiesArr,
  );
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
 * @param {string} state
 * @param {string} country
 * @returns {string} location (hyphenated)
 */
const getLocation = (neighborhood, city, state = '', country) => (
  `${neighborhood}${city}--${state}${country}`
    .replaceAll(' ', '-')
);

export {
  getCountry,
  getState,
  getCity,
  getNeighborhood,
  getLocation,
};
