#!/usr/bin/env node

///////////////////////////////////////////////////////////////////////////////
// imports - node pkgs ////////////////////////////////////////////////////////
import moment from 'moment';
// imports - local modules ////////////////////////////////////////////////////
import {
  getCountry,
  getUSState,
  getCity,
  getNeighborhood,
  getLocation,
} from './src/location.mjs';
import { monthly, getCheckIn, getCheckOut } from './src/dates.mjs';
import getABnBs from "./src/getABnBs.mjs";
///////////////////////////////////////////////////////////////////////////////


console.log('If default provided, press Enter to select');

// location ///////////////////////////////////////////////////////////////////
// const country = await getCountry();
// const usState = (country === 'United States') ? await getUSState() : '';
// const city = await getCity(country);
// const neighborhood = await getNeighborhood();
// const location = await getLocation(neighborhood, city, usState, country);

// dates //////////////////////////////////////////////////////////////////////
const { isMonthly, months, checkIn } = await monthly();
console.log({ isMonthly, months, checkIn });

if (!isMonthly) {
  const checkIn = await getCheckIn();
  console.log({ checkIn });
  const checkOut = await getCheckOut(checkIn);
  console.log({ checkOut });
}



///////////////////////////////////////////////////////////////////////////////
// amenities //////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// console.log();
// const amenitiesArr = [
//   { message: 'WiFi    \u{1F310}', name: 4 },
//   { message: 'Washer  \u{1F455}', name: 33 },
//   { message: 'Dryer   \u{1F456}', name: 34 },
//   { message: 'A/C      \u{2744}', name: 5 },
//   { message: 'Heater   \u{2668}', name: 30 },
//   { message: 'Pool    \u{1F3D6}', name: 7 },
//   { message: 'Hot Tub \u{1F6C1}', name: 25 },
//   { message: 'Gym     \u{1F3CB}', name: 15 },
//   { message: 'Kitchen \u{1F373}', name: 8 },
// ];
// const amenitiesPrompt = new MultiSelect({
//   message: 'Choose Amenities',
//   limit: 7,
//   choices: amenitiesArr,
// });
// const amenities = await amenitiesPrompt.run()
//   .then(amenities => amenities)
//   .catch(console.error);

///////////////////////////////////////////////////////////////////////////////
// price //////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// console.log();
// const priceMin = await strPrompt('Minimum price');
// const priceMax = await strPrompt('Maximum price');


// console.log()
// import makeUrl from './src/makeUrl.mjs';
// const link = makeUrl(location, isMonthly, months, checkIn, checkOut, priceMin, priceMax, amenities);
// console.log({ link });


// console.log({ monthly, checkIn, checkOut, priceMin, priceMax });


// await getAirbnbHotels(location, monthly, checkIn, checkOut, priceMin, priceMax);
