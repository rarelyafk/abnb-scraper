///////////////////////////////////////////////////////////////////////////////
// dates //////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// imports ////////////////////////////////////////////////////////////////////
import moment from 'moment';
import { exec } from 'child_process';
import { promisify } from 'util';
const pExec = promisify(exec);
// imports - local ////////////////////////////////////////////////////////////
import { acPrompt, Toggle } from '../prompts/index.mjs';

  
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
    (_, i) => (Number(checkInYear || currentYear) + i).toString(),
  );
  return await acPrompt('Pick a year', next5YearsArr, (checkInYear || currentYear));
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
import inquirer from 'inquirer';
import Prompt from 'inquirer-datepicker-prompt';
inquirer.registerPrompt('datepicker', Prompt);

const today = moment(new Date()).format('YYYY-MM-DD');
const getCheckIn = async () => {
  const date1 = await inquirer.prompt({
    name: 'checkInDate',
    type: 'datepicker',
    message: 'Check-In',
    format: ['yyyy', '-', 'mm', '-', 'dd'],
    date: { min: today },
  });
  const { checkInDate } = date1;
  const checkIn = moment(checkInDate).format('YYYY-MM-DD');
  return { checkIn, checkInDate };
};

const getCheckOut = async (checkInDate) => {
  const checkInPlus1 = moment(checkInDate).add(1, 'days').format('YYYY-MM-DD');
  const date2 = await inquirer.prompt({
    name: 'checkOutDate',
    type: 'datepicker',
    message: 'Check-Out',
    format: ['yyyy', '-', 'mm', '-', 'dd'],
    date: { min: checkInPlus1 },
  });
  const { checkOutDate } = date2;
  const checkOut = moment(checkOutDate).format('YYYY-MM-DD');
  return checkOut;
};

export {
  monthly,
  getCheckIn,
  getCheckOut,
};
