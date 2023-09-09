import getBrowserInstance from "./browserInstance.mjs";
import makeUrl from './makeUrl.mjs';
import loadPage from './loadPage.mjs';

const getABnBs = async (location, monthly, checkIn, checkOut, priceMin, priceMax) => {
  const url = makeUrl(location, monthly, checkIn, checkOut, priceMin, priceMax);

  const { page, closeBrowser } = await getBrowserInstance();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // await page.waitForSelector('#site-content');

  const waitAndClick = async selector => {
    if (await page.$(selector) !== null) {
      await page.waitForSelector(selector);
      await page.click(selector);
    }
  };

  await page.waitForSelector('#site-content'); // main site content
  // await waitAndClick('.c1pmjrqe');             // display total price (width1)
  await waitAndClick('.canm9xs');              // display total price (width2)

  let cnt = 1;
  console.log(`Page ${cnt}`);
  await loadPage(page, location);

  const isNextPage = await page.$('[aria-label="Next"][disabled]') === null;
  while (isNextPage) {
    console.log(`Page ${cnt}`);
    await loadPage(page, location);
    await page.click('[aria-label="Next"]:not([disabled])');
    cnt++;
  }

  await closeBrowser();
};

export default getABnBs;
