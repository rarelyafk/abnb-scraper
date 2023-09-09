import { MultiSelect } from './prompts.mjs';

///////////////////////////////////////////////////////////////////////////////
// amenities //////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const amenitiesArr = [
  { message: 'WiFi    \u{1F310}', name: 4 },
  { message: 'Washer  \u{1F455}', name: 33 },
  { message: 'Dryer   \u{1F456}', name: 34 },
  { message: 'A/C      \u{2744}', name: 5 },
  { message: 'Heater   \u{2668}', name: 30 },
  { message: 'Pool    \u{1F3D6}', name: 7 },
  { message: 'Hot Tub \u{1F6C1}', name: 25 },
  { message: 'Gym     \u{1F3CB}', name: 15 },
  { message: 'Kitchen \u{1F373}', name: 8 },
];

const amenitiesPrompt = new MultiSelect({
  message: 'Choose Amenities',
  limit: 7,
  choices: amenitiesArr,
});

const getAmenities = async () => {
  const amenities = await amenitiesPrompt.run()
    .then(amenities => amenities)
    .catch(console.error);
};

export default getAmenities;
