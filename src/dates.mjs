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
/**
  * @param {string} [checkInYear='']
  * @returns {function: string}
  */
const getYear = async (checkInYear = '') => {
  const next5YearsArr = Array.from(
    { length: 5 },
    (_, i) => (Number(checkInYear || currentYear) + i).toString()
  );
  return await acPrompt('Pick a year', next5YearsArr, checkInYear);
};

/**
  * @param {string} checkInYear
  * @param {string} [checkInMonth='']
  * @param {string} [checkOutYear='']
  * @returns {string[]} months
  */
const makeMonthsArr = (checkInYear, checkInMonth = '', checkOutYear = '') => {
  if (checkInYear === checkOutYear) {
    const monthsAfterCheckIn = months.slice(months.indexOf(checkInMonth));
    return monthsAfterCheckIn;
  }

  if ((!checkOutYear) && (checkInYear === currentYear)) {
    const monthsLeftThisYear = months.slice(Number(currentMonth) - 1);
    return monthsLeftThisYear;
  }

  return months;
};

/**
  * @param {string} checkInYear
  * @param {bool} [isMonthly=false]
  * @param {string} [checkInMonth='']
  * @param {string} [checkOutYear='']
  */
const getMonth = async (checkInYear, isMonthly = false, checkInMonth = '', checkOutYear = '') => {
  const monthsArr = makeMonthsArr(checkInYear, checkInMonth, checkOutYear);
  const monthSel = await acPrompt(
    isMonthly ? `Starting which month (of ${checkInYear})?` : 'Pick a month',
    [...monthsArr],
    (checkInYear === checkOutYear) ? checkInMonth : '',
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
    checkIn
  };
};

// daily //////////////////////////////////////////////////////////////////////
/**
  * @param {string} y - year
  * @param {string} m - month
  * @param {number} [d=0] day
  * @param {string} [ciy=''] - check-in year
  * @param {string} [cim=''] - check-in month
  * @returns {string[]} days
  */
const makeDayArr = (y, m, d = 0, ciy = '', cim = '') => {
  // console.log({y,m,d,ciy,cim});
  const daysInMonth = moment(
    `${y || currentYear}-${m || currentMonth}`,
    'YYYY-MM'
  ).daysInMonth();


  if ((y === currentYear) && (m == currentMonth)) {
    const currentDayNum = Number(currentDay);

    if (d) {
      return Array.from(
        { length: (daysInMonth - d) },
        (_, i) => ( (d + i + 1).toString().padStart(2, '0') )
      );
    }

    return Array.from(
      { length: (daysInMonth - currentDayNum) },
      (_, i) => ( (currentDayNum + i).toString().padStart(2, '0') )
    );
  }

  if (ciy && cim) {
    if ((Number(y) > Number(ciy)) || (Number(m) > Number(cim)))
      return Array.from(
        { length: daysInMonth },
        (_, i) => ( (i + 1).toString().padStart(2, '0') )
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
  * @param {string} year
  * @param {string} month
  * @param {number|null} [d=null]
  * @param {string} [checkInYear='']
  * @param {string} [checkInMonth='']
  * @returns {string} day
  */
const getDay = async (year, month, d = null, checkInYear = '', checkInMonth = '') => {
  // console.log({ d });

  const daysArr = makeDayArr(year, month, d, checkInYear, checkInMonth);
  // console.log({ daysArr });
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

  // console.log({ checkInMonth });

  const year = await getYear(y);
  const month = await getMonth(y, false, checkInMonth, year);
  const day = await getDay(year, month, (Number(d)), y, m);

  return `${year}-${month}-${day}`;
};

export {
  monthly,
  getCheckIn,
  getCheckOut,
};
