#!/usr/bin/env node
///////////////////////////////////////////////////////////////////////////////
// imports - node /////////////////////////////////////////////////////////////
import { existsSync, mkdirSync } from 'fs';

// imports - local ////////////////////////////////////////////////////////////
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

// setup //////////////////////////////////////////////////////////////////////
if (!existsSync('./csvs'))
  mkdirSync('./csvs')

console.log('If default provided, press Enter to select');
console.log();

const yelLog = str => console.log("\x1b[33m%s\x1b[0m", str);


// location ///////////////////////////////////////////////////////////////////
yelLog('LOCATION');
const country = await getCountry();
const state = await getState(country);
const city = await getCity(country, state);
const neighborhood = await getNeighborhood();
const location = getLocation(neighborhood, city, state, country);


// dates //////////////////////////////////////////////////////////////////////
yelLog('DATES');
const { isMonthly, months, checkIn: monthlyCheckIn } = await monthly();
const { checkIn, checkInDate } = isMonthly
  ? { monthlyCheckIn }
  : await getCheckIn();
const checkOut = isMonthly ? '' : await getCheckOut(checkInDate);


// price //////////////////////////////////////////////////////////////////////
yelLog('PRICE');
const priceMin = await getMinPrice();
const priceMax = await getMaxPrice();


// amenities //////////////////////////////////////////////////////////////////
yelLog('AMENITIES');
const amenities = await getAmenities();


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
