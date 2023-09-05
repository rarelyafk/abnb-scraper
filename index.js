#!/usr/bin/env node

///////////////////////////////////////////////////////////////////////////////
// imports - node pkgs ////////////////////////////////////////////////////////
import enquirer from 'enquirer';
import moment from 'moment';
// imports - local modules ////////////////////////////////////////////////////
import countries from './data/countries.mjs';
import usStates from './data/usStates.mjs';
import cities from './data/cities.mjs';
import getABnBs from "./src/getABnBs.mjs";
///////////////////////////////////////////////////////////////////////////////

const { AutoComplete, StringPrompt, Toggle, MultiSelect } = enquirer;

const acPrompt = async (message, choices, init) => {
  const initial = init ? init.indexOf(init) : null;
  const prompt = new AutoComplete({ message, choices, initial, limit: 10 });
  return await prompt.run().then(res => res).catch(console.error);
}

const strPrompt = async message => {
  const prompt = new StringPrompt({ message });
  return await prompt.run().then(res => res).catch(console.error);
}


///////////////////////////////////////////////////////////////////////////////
// location ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
 
// location - country /////////////////////////////////////////////////////////
const countriesArr = countries.map(({ name }) => name);
const country = await acPrompt(
  'Pick country (press Enter for default ("United States")',
  countriesArr,
  'United States',
);

// location - usState /////////////////////////////////////////////////////////
const usStatesArr = usStates.map(({ name }) => name).sort();
const usState = (country === 'United States')
  ? `${await acPrompt('Pick a US State', usStatesArr)}--`
  : '';

// location - city ////////////////////////////////////////////////////////////
const countryCode = countries.find(({ name }) => (name === country)).code;
const citiesArr = cities
  .filter(({ country: pickedCountry }) => pickedCountry === countryCode)
  .map(({ name }) => name)
  .sort();
const city = await acPrompt(`Pick a city in ${country}`, citiesArr);

// location - neighborhood ////////////////////////////////////////////////////
const neighborhood = await strPrompt('Enter a neighborhood (OPTIONAL)');

// location  //////////////////////////////////////////////////////////////////
const location = `${neighborhood}${city}--${usState}${country}`
  .replaceAll(' ', '-');

///////////////////////////////////////////////////////////////////////////////
// dates //////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
const monthlyPrompt = new Toggle({
  message: 'Book monthly?',
  enabled: 'Yes, monthly',
  disabled: 'No, I want to select specific dates',
});
const isMonthly = await monthlyPrompt.run()
  .then(isMonthly => isMonthly)
  .catch(console.error);

const getNumberOfMonths = async () => {
  const numOfMonthsArr = Array(12)
    .fill()
    .map((_, i) => (i + 1).toString());
  const months = await acPrompt('Number of months', numOfMonthsArr);
  return months;
}
const months = isMonthly
  ? await getNumberOfMonths()
  : null;
console.log({ months });

const getYear = async () => (
  await acPrompt('Pick a year', ['2023', '2024', '2025'])
);

const getMonth = async () => {
  const monthsArr = moment.months();
  const monthSel = await acPrompt('Pick a month', monthsArr);
  const month = ((monthsArr.find(obj => obj.value === monthSel)).index + 1)
    .toString()
    .padStart(2,'0');
  return month;
};

const getDate = async (msg, checkIn) => {
  console.log()
  console.log(msg);
  const year = await getYear();
  const month = await getMonth();
  const daysInMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
  const daysArr = Array(daysInMonth)
    .fill()
    .map((_, i) => (i + 1).toString().padStart(2, '0'));
  const dayUnformatted = await acPrompt('Pick a day', daysArr);
  const day = dayUnformatted.padStart(2, '0');
  return `${year}-${month}-${day}`;
}
if (isMonthly)
  console.log('Pick starting month');
const checkIn = isMonthly
  ? `${await getYear()}-${await getMonth()}-01`
  : await getDate('Check-In date:');

const checkOut = isMonthly
  ? null
  : await getDate('Check-Out date:', checkIn);

if (!isMonthly && (moment(checkOut).isSameOrBefore(checkIn, 'day')))
  throw new Error('checkOut date cannot be before checkIn date!');

console.log({ checkIn, checkOut });




///////////////////////////////////////////////////////////////////////////////
// amenities //////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

console.log();
const amenitiesArr = [
  { message: 'WiFi    \u{1F310}', name: 4 },
  { message: 'Washer  \u{1F455}', name: 33 },
  { message: 'Dryer   \u{1F456}', name: 34 },
  { message: 'A/C      \u{2744}', name: 5 },
  { message: 'Heater   \u{2668}', name: 30 },
  { message: 'Pool    \u{1F3D6}', name: 7 },
  { message: 'Hot Tub \u{1F6C1}', name: 25 },
  { message: 'Gym     \u{1F3CB}', name: 15 },
  { message: 'Kitchen \u{1F373}', name: 8 },
];
const amenitiesPrompt = new MultiSelect({
  message: 'Choose Amenities',
  limit: 7,
  choices: amenitiesArr,
});
const amenities = await amenitiesPrompt.run()
  .then(amenities => amenities)
  .catch(console.error);

///////////////////////////////////////////////////////////////////////////////
// price //////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

console.log();
const priceMin = await strPrompt('Minimum price');
const priceMax = await strPrompt('Maximum price');


console.log()
import makeUrl from './src/makeUrl.mjs';
const link = makeUrl(location, isMonthly, months, checkIn, checkOut, priceMin, priceMax, amenities);
console.log({ link });


// console.log({ monthly, checkIn, checkOut, priceMin, priceMax });


// await getAirbnbHotels(location, monthly, checkIn, checkOut, priceMin, priceMax);
