import moment from 'moment';

const makeUrl = (
  location,
  isMonthly,
  months,
  checkIn,
  checkOut,
  priceMin,
  priceMax,
  amenities,
) => {
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
  queryParams += '&search_type=autocomplete_click';
  // queryParams += '&search_type=filter_change';

  if (priceMin)
    queryParams += `&price_min=${priceMin}`;
  if (priceMax)
    queryParams += `&price_max=${priceMax}`;
  
  queryParams += `&${encodeURIComponent('room_types[]')}=${encodeURIComponent('Entire home/apt')}`;

  if (amenities?.length) {
    for (const amenity of amenities)
      queryParams += `&${encodeURIComponent('amenities[]')}=${amenity}`;
  }

  const host = 'https://www.airbnb.com';
  const url = `${host}/s/${location}/homes?${queryParams}`;
  return url;
};

export default makeUrl;
