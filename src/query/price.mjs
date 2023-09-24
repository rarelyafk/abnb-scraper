import { StringPrompt } from '../prompts/index.mjs';

const validate = str => {
  if (!str)
    return true;
  if (isNaN(str) || isNaN(parseFloat(str)))
    return minPricePrompt.styles.danger('numbers only please');

  const num = Number(str);
  if (num < 0)
    return minPricePrompt.styles.danger('numbers less than 0 not allowed...');
  if (num > 9999)
    return minPricePrompt.styles.danger('numbers more than 9999 not allowed...');

  return true;
};

const minPricePrompt = new StringPrompt({
  type: 'string',
  name: 'minPrice',
  message: 'Minimum Price',
  validate,
});

const maxPricePrompt = new StringPrompt({
  type: 'string',
  name: 'maxPrice',
  message: 'Maximum Price',
  validate,
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
