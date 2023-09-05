import moment from 'moment';

const makeUrl = (location, isMonthly, months, checkIn, checkOut, priceMin, priceMax, amenities) => {
  console.log('makeUrl: ', { location, isMonthly, months, checkIn, checkOut, priceMin, priceMax });
  
  let queryParams = '';

  queryParams += 'tab_id=home_tab';
  queryParams += `&${encodeURIComponent('refinement_paths[]')}=${encodeURIComponent('/homes')}`;
  queryParams += `&${encodeURIComponent('flexible_trip_lengths[]')}=one_week`;

  if (isMonthly) {
    queryParams += `&monthly_start_date=${checkIn}`;
    queryParams += `&monthly_length=${months}`;
    queryParams += '&price_filter_input_type=0';
    queryParams += '&price_filter_num_nights=5';
  } else {
    const monthStart = checkIn.slice(0, -2) + '01';
    queryParams += `&monthly_start_date=${monthStart}`;
    queryParams += '&monthly_length=3';
    queryParams += '&price_filter_input_type=0';
    const checkInM = moment(checkIn);
    const checkOutM = moment(checkOut);
    const nights = Math.abs(checkInM.diff(checkOutM, 'days'));
    queryParams += `&price_filter_num_nights=${nights}`;
  }

  queryParams += '&channel=EXPLORE';

  if (isMonthly)
    queryParams += '&date_picker_type=monthly_stay';
  else
    queryParams += '&date_picker_type=calendar';

  // &query=Chicago%2C%20IL
  // &place_id=ChIJ7cv00DwsDogRAMDACa2m4K8

  if (!isMonthly) {
    queryParams += `&checkin=${checkIn}`;
    queryParams += `&checkout=${checkOut}`;
  }

  queryParams += '&adults=1';
  queryParams += '&source=structured_search_input_header';
  queryParams += '&search_type=autocomplete_click'; // queryParams += '&search_type=filter_change';

  if (priceMin)
    queryParams += `&price_min=${priceMin}`;
  if (priceMax)
    queryParams += `&price_max=${priceMax}`;
  
  queryParams += `&${encodeURIComponent('room_types[]')}=${encodeURIComponent('Entire home/apt')}`;

  if (amenities) {
    for (const amenity of amenities)
      queryParams += `&${encodeURIComponent('amenities[]')}=${amenity}`;
  }

  const host = 'https://www.airbnb.com';
  const url = `${host}/s/${location}/homes?${queryParams}`;
  return url;

  // &refinement_paths%5B%5D=%2Fhomes
  // &flexible_trip_lengths%5B%5D=one_week
  // &monthly_start_date=2023-10-01
  // &monthly_length=3
  // &price_filter_input_type=0
  // &price_filter_num_nights=5
  // &channel=EXPLORE
  // &query=Los%20Angeles%2C%20CA
  // &place_id=ChIJE9on3F3HwoAR9AhGJW_fL-I
  // &date_picker_type=calendar
  // &checkin=2023-09-15
  // &checkout=2023-09-20
  // &adults=1
  // &source=structured_search_input_header
  // &search_type=filter_change
  // &price_min=500
  // &room_types%5B%5D=Entire%20home%2Fapt
  // &amenities%5B%5D=30


  // generic //////////////////////////////////////////////////////////////////
  // queryParams += '&adults=1&channel=EXPLORE&tab_id=home_tab';
  // queryParams += '&price_filter_input_type=1';              // ?
  // queryParams += `&${encodeURIComponent('refinement_paths[]')}=${encodeURIComponent('/homes')}`;
  // queryParams += `&${encodeURIComponent('room_types[]')}=${encodeURIComponent('Entire home/apt')}`;
  // queryParams += `&${encodeURIComponent('amenities[]')}=4`;
  // multiple amenities, just add
  // queryParams += `&${encodeURIComponent('amenities[]')}=7`;

  // date /////////////////////////////////////////////////////////////////////
  // queryParams += `&checkIn=${checkIn}`;
  // queryParams += `&checkOut=${checkOut}`;
  // const dateArr = checkIn.split('-');
  // queryParams += `&monthly_start_date=${dateArr[0]}-${dateArr[1]}-01`;
  // queryParams += monthly
  //   ? '&date_picker_type=monthly_stay&monthly_length=1&price_filter_num_nights=30' // MONTHLY
  //   : '&date_picker_type=calendar';                                                // DAILY
  // price filters ///////////////////////////////////////////////////////////
  // queryParams += `&price_min=${priceMin}`;
  // queryParams += `&price_max=${priceMax}`;

  // const url = `${host}/s/${location}/homes?${queryParams}`;
  // console.log({ url });

  // return url;
};

export default makeUrl;
