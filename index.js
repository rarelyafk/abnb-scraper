#!/usr/bin/env node
///////////////////////////////////////////////////////////////////////////////
// imports - local modules ////////////////////////////////////////////////////
 
import {
  getCountry,
  getUSState,
  getCity,
  getNeighborhood,
  getLocation,
} from './src/location.mjs';
import {
  monthly,
  getCheckIn,
  getCheckOut,
} from './src/dates.mjs';
import getABnBs from "./src/getABnBs.mjs";

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


// amenities //////////////////////////////////////////////////////////////////
console.log();
import getAmenities from './src/amenities.mjs';
const amenities = await getAmenities();


// price //////////////////////////////////////////////////////////////////////
import { getMinPrice, getMaxPrice } from './src/price.mjs';

console.log();
const priceMin = await getMinPrice();
const priceMax = await getMaxPrice();


// link ///////////////////////////////////////////////////////////////////////
console.log()
import makeUrl from './src/makeUrl.mjs';
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


// console.log({ monthly, checkIn, checkOut, priceMin, priceMax });

await getABnBs(location, monthly, checkIn, checkOut, priceMin, priceMax);
