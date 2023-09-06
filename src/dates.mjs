import moment from 'moment';
import { acPrompt, Toggle } from './prompts.mjs';

///////////////////////////////////////////////////////////////////////////////
// dates //////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
  
// data ///////////////////////////////////////////////////////////////////////
const currentYear = moment().format('YYYY');
const currentMonth = moment().format('MM');
const currentDay = moment().format('DD');
const months = moment.months();

// func ///////////////////////////////////////////////////////////////////////
const getYear = async checkInYear => {
  const next5YearsArr = Array.from(
    { length: 5 },
    (_, i) => (Number(currentYear || checkInYear) + i).toString()
  );
  return await acPrompt('Pick a year', next5YearsArr, checkInYear);
};

const makeMonthsArr = (year, checkInMonth = '') => {
  if (checkInMonth)
    return months.slice(months.indexOf(checkInMonth))
  if (year === currentYear)
    return months.slice(Number(currentMonth) - 1)
  return months;
};

const getMonth = async (year, isMonthly = false, checkInMonth = '') => {
  const monthsArr = makeMonthsArr(year, checkInMonth);
  const monthSel = await acPrompt(
    isMonthly ? `Starting which month (of ${year})?` : 'Pick a month',
    [...monthsArr],
    checkInMonth,
  );

  // NOTE: not sure why this is an array of obj's sometimes...
  // NOTE: enquire mutates the array, SEND COPIES!!!
  // const monthNum = (typeof months[0] === 'string')
  //   ? (months.indexOf(monthSel) + 1)
  //   : (months.find(obj => obj?.value === monthSel)?.index + 1);

  const month = ( (months.indexOf(monthSel) + 1).toString().padStart(2, '0') );

  return month;
};

// monthly ////////////////////////////////////////////////////////////////////
const monthly = async () => {
  const monthlyPrompt = new Toggle({
    message: 'Book monthly?',
    enabled: 'Yes, monthly',
    disabled: 'No, I want to select specific dates',
  });

  const isMonthly = await monthlyPrompt.run()
    .then(isMonthly => isMonthly)
    .catch(console.error);

  if (isMonthly)
    console.log('Check-In Date');
  else
    return { isMonthly };

  const year = await getYear();
  const month = await getMonth(year, true);
  // &monthly_start_date=2023-10-01

  const getNumberOfMonths = async () => {
    const numOfMonthsArr = Array(12)
      .fill()
      .map((_, i) => (i + 1).toString());
    const months = await acPrompt('Number of months', [...numOfMonthsArr]);
    return months;
  }

  const months = await getNumberOfMonths();
  
  const checkIn = `${year}-${month}-01`;

  return {
    isMonthly,
    months,
    checkIn,
  };
};

// daily //////////////////////////////////////////////////////////////////////
const makeDayArr = (y, m, d = 0) => {
  const daysInMonth = moment(`${y || currentYear}-${m || currentMonth}`, 'YYYY-MM').daysInMonth();

  if (d) {
    return Array.from(
      { length: (daysInMonth - d) },
      (_, i) => ( (d + i).toString().padStart(2, '0') )
    );
  }

  if ((y === currentYear) && (m == currentMonth)) {
    const currentDayNum = Number(currentDay);
    return Array.from(
      { length: (daysInMonth - currentDayNum) },
      (_, i) => ( (currentDayNum + i).toString().padStart(2, '0') )
    );
  }

  return Array.from(
    { length: daysInMonth },
    (_, i) => ( (i + 1).toString().padStart(2, '0') )
  );
};

const getDay = async (year, month, d = null) => {
  console.log({ d });

  const daysArr = makeDayArr(year, month, d);
  console.log({ daysArr });
  const dayUnformatted = await acPrompt('Pick a day', [...daysArr]);

  const day = dayUnformatted.padStart(2, '0');
  return day;
};

const getCheckIn = async () => {
  console.log();
  console.log('Check-In Date:');

  const year = await getYear();
  const month = await getMonth(year, false);
  const day = await getDay(year, month);

  return `${year}-${month}-${day}`;
};

const getCheckOut = async (checkIn) => {
  console.log();
  console.log('Check-Out Date:');

  const [y, m, d] = checkIn.split('-');

  const checkInMonth = months[(Number(m) - 1)];
  // NOTE: sending array copies to enquire now, no need for ternary...
  // const checkInMonth = (typeof (months[(Number(m) + 1)]) === 'string')
  //   ? months[(Number(m) + 1)]
  //   : months[(Number(m) + 1)]?.value;
  console.log({ checkInMonth });

  const year = await getYear(y);
  const month = await getMonth(year, false, checkInMonth);
  const day = await getDay(year, month, (Number(d) + 1));

  return `${year}-${month}-${day}`;
};

export {
  monthly,
  getCheckIn,
  getCheckOut,
};
