#!/usr/bin/env node

import moment from 'moment';
import { acPrompt } from '../prompts.mjs';

// data ///////////////////////////////////////////////////////////////////////
const currentYear = moment().format('YYYY');
const currentMonth = moment().format('MM');
const currentDay = moment().format('DD');
console.log({ currentYear, currentMonth, currentDay });
///////////////////////////////////////////////////////////////////////////////

/**
  * @param {string} y - year (YYYY)
  * @param {string} m - month (MM)
  * @param {number} [d=0] day
  * @returns {string[]} days
  */
const makeDayArr = (y, m, d = 0) => {
  const daysInMonth = moment(
    `${y || currentYear}-${m || currentMonth}`,
    'YYYY-MM'
  ).daysInMonth();


  if ((y === currentYear) && (m == currentMonth)) {
    const currentDayNum = Number(currentDay);
    console.log({ currentDayNum });

    if (d) {
      return Array.from(
        { length: (daysInMonth - d) },
        (_, i) => ( (d + i + 1).toString().padStart(2, '0') )
      );
    }

    return Array.from(
      { length: (daysInMonth - currentDayNum) },
      (_, i) => ( (currentDayNum + i + 1).toString().padStart(2, '0') )
    );
  }

  if (d) {
    return Array.from(
      { length: (daysInMonth - d) },
      (_, i) => ( (d + i + 1).toString().padStart(2, '0') )
    );
  }

  return Array.from(
    { length: daysInMonth },
    (_, i) => ( (i + 1).toString().padStart(2, '0') )
  );
};

/**
  * @param {string} year (YYYY)
  * @param {string} month (MM)
  * @param {number|null} [d=null]
  * @returns {string} day
  */
const getDay = async (year, month, d = null) => {
  console.log({ d });

  const daysArr = makeDayArr(year, month, d);
  console.log({ daysArr });
  const dayUnformatted = await acPrompt('Pick a day', [...daysArr]);

  const day = dayUnformatted.padStart(2, '0');
  return day;
};

const test = async (y, m, d = null) => {
  console.log({ y, m, d });
  const day = await getDay(y,m,d);
  console.log({ day });
};

// test('2023', '09');
// test('2023', '10');
// test('2023', '09', 8);
// test('2023','10',1);
// test('2023','11',1);
// test('2024','01',1);
test('2024','01',1);
