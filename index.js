#!/usr/bin/env node
///////////////////////////////////////////////////////////////////////////////
// imports - local modules ////////////////////////////////////////////////////
 
import {
  getCountry,
  getState,
  getCity,
  getNeighborhood,
  getLocation,
} from './src/query/location.mjs';
import {
  monthly,
  getCheckIn,
  getCheckOut,
} from './src/query/dates.mjs';
import {
  getMinPrice,
  getMaxPrice,
} from './src/query/price.mjs';
import getAmenities from './src/query/amenities.mjs';
import makeUrl from './src/query/makeUrl.mjs';
import getABnBs from "./src/scraper/getABnBs.mjs";
///////////////////////////////////////////////////////////////////////////////


console.log('If default provided, press Enter to select');
console.log();

const yelLog = str => console.log("\x1b[33m%s\x1b[0m", str);


// location ///////////////////////////////////////////////////////////////////
yelLog('LOCATION');
const country = await getCountry();
// console.log({ country });
const state = await getState(country);
// console.log({ state });
const city = await getCity(country, state);
// console.log({ city });
const neighborhood = await getNeighborhood();
// console.log({ neighborhood });
const location = getLocation(neighborhood, city, state, country);
// console.log({ location });


// dates //////////////////////////////////////////////////////////////////////
yelLog('DATES');
const { isMonthly, months, checkIn: monthlyCheckIn } = await monthly();
// console.log({ isMonthly, months, monthlyCheckIn });
const { checkIn, checkInDate } = isMonthly
  ? { monthlyCheckIn }
  : await getCheckIn();
// console.log({ checkIn });
const checkOut = isMonthly ? '' : await getCheckOut(checkInDate);
// console.log({ checkOut });


// price //////////////////////////////////////////////////////////////////////
yelLog('PRICE');
const priceMin = await getMinPrice();
const priceMax = await getMaxPrice();


// amenities //////////////////////////////////////////////////////////////////
yelLog('AMENITIES');
const amenities = await getAmenities();
// console.log({ amenities });


// link ///////////////////////////////////////////////////////////////////////
console.log()
const url = makeUrl(
  location,
  isMonthly,
  months,
  checkIn,
  checkOut,
  priceMin,
  priceMax,
  amenities,
);
console.log({ url });


// getABnBs ///////////////////////////////////////////////////////////////////
await getABnBs(url, location);
