import moment from 'moment';
import { acPrompt, Toggle } from './prompts.mjs';

///////////////////////////////////////////////////////////////////////////////
// dates //////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
  
// data ///////////////////////////////////////////////////////////////////////
const currentYear = moment().format('YYYY');
const currentMonth = moment().format('MM');
const currentDay = moment().format('DD');

// func ///////////////////////////////////////////////////////////////////////
const getYear = async y => {
  const next5YearsArr = Array.from(
    { length: 5 },
    (_, i) => (Number(currentYear) + i).toString()
  );
  return await acPrompt('Pick a year', next5YearsArr, y);
};

const getMonth = async (year, m = null) => {
  const months = moment.months();
  const monthsArr = (year === currentYear)
    ? months.slice(Number(currentMonth) - 1)
    : months;
  const monthSel = await acPrompt(
    year ? `Starting which month (of ${year})?` : 'Pick a month',
    monthsArr,
    m,
  );

  // NOTE: not sure why this is an array of obj's sometimes...
  const monthNum = (typeof months[0] === 'string')
    ? (months.indexOf(monthSel) + 1)
    : (months.find(obj => obj.value === monthSel).index + 1);
  const month = monthNum.toString().padStart(2, '0');

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
  const month = await getMonth(year);
  // &monthly_start_date=2023-10-01

  const getNumberOfMonths = async () => {
    const numOfMonthsArr = Array(12)
      .fill()
      .map((_, i) => (i + 1).toString());
    const months = await acPrompt('Number of months', numOfMonthsArr);
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

///////////////////////////////////////////////////////////////////////////////




// const getDate = async (msg, checkInDate) => {
//   console.log()
//   console.log(msg);

//   const [y, mI, d] = checkInDate ? checkInDate.split('-') : [null, null, null];
//   const monthsArr = moment.months();
//   const mV = checkInDate ? monthsArr[(Number(mI) + 1)] : null;
//   console.log({ checkInDate, y, mI, mV, d });

//   const year = await getYear(y);
//   const month = await getMonth(null, mV);
//   const daysInMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
//   const daysArr = checkInDate
//     ? Array(daysInMonth).fill()
//       .map((_, i) => (
//         (i > Number(d))
//           ? (i + 1).toString().padStart(2, '0')
//           : null
//       ))
//     : Array(daysInMonth).fill()
//       .map((_, i) => (i + 1)).toString().padStart(2, '0');

//   const dayUnformatted = acPrompt('Pick a day', daysArr);
//   const day = dayUnformatted.padStart(2, '0');
//   return `${year}-${month}-${day}`;
// }


// const checkInYear = await getYear();

// const checkIn = isMonthly
//   ? `${checkInYear}-${await getMonth(checkInYear)}-01`
//   : await getDate('Check-In Date');

// const checkOut = isMonthly
//   ? null
//   : await getDate('Check-Out Date', checkIn);

// if (!isMonthly && (moment(checkOut).isSameOrBefore(checkIn, 'day')))
//   throw new Error('checkOut date cannot be before checkIn date!');

// console.log({ checkIn, checkOut });

export {
  monthly,
  // getCheckIn,
  // getCheckOut,
}
