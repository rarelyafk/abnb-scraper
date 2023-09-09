import { StringPrompt } from '../prompts/index.mjs';

const minPricePrompt = new StringPrompt({
  type: 'string',
  name: 'minPrice',
  message: 'Minimum Price',
  validate: (value) => {
    if (Number(value) <= 0)
      return prompt.styles.danger('numbers less than 0 not allowed...');
    if (Number(value) >= 9999)
      return prompt.styles.danger('numbers more than 9999 not allowed...');
    return true;
  },
});

const maxPricePrompt = new StringPrompt({
  type: 'string',
  name: 'maxPrice',
  message: 'Maximum Price',
  validate: (value) => {
    if (Number(value) <= 0)
      return prompt.styles.danger('numbers less than 0 not allowed...');
    if (Number(value) >= 9999)
      return prompt.styles.danger('numbers more than 9999 not allowed...');
    return true;
  },
});

const getMinPrice = async () => (
  await minPricePrompt.run()
    .then(minPrice => minPrice)
    .catch(console.error)
);

const getMaxPrice = async () => (
  await maxPricePrompt.run()
    .then(minPrice => minPrice)
    .catch(console.error)
);

export { getMinPrice, getMaxPrice };
