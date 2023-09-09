#!/usr/bin/env node
///////////////////////////////////////////////////////////////////////////////
// imports - local modules ////////////////////////////////////////////////////
 
import {
  getCountry,
  getUSState,
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

// location ///////////////////////////////////////////////////////////////////
const country = await getCountry();
const usState = (country === 'United States') ? await getUSState() : '';
const city = await getCity(country);
const neighborhood = await getNeighborhood();
const location = getLocation(neighborhood, city, usState, country);

// dates //////////////////////////////////////////////////////////////////////
const { isMonthly, months, monthlyCheckIn } = await monthly();
// console.log({ isMonthly, months, checkIn });
const checkIn = isMonthly ? monthlyCheckIn : await getCheckIn();
// console.log({ checkIn });
const checkOut = isMonthly ? '' : await getCheckOut(checkIn);
// console.log({ checkOut });


// price //////////////////////////////////////////////////////////////////////
console.log();
const priceMin = await getMinPrice();
const priceMax = await getMaxPrice();


// amenities //////////////////////////////////////////////////////////////////
console.log();
const amenities = await getAmenities();


// link ///////////////////////////////////////////////////////////////////////
console.log()
// console.log({ monthly, checkIn, checkOut, priceMin, priceMax });
const link = makeUrl(
  location,
  isMonthly,
  months,
  checkIn,
  checkOut,
  priceMin,
  priceMax,
  amenities,
);
console.log({ link });


// getABnBs ///////////////////////////////////////////////////////////////////
// await getABnBs(location, monthly, checkIn, checkOut, priceMin, priceMax);
