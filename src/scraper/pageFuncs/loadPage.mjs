import scrollPage from './scrollPage.mjs';
import parseRooms from './parseRooms.mjs';


const loadPage = async (page, location) => {
  console.log('  loading page');

  await page.waitForSelector('#site-content'); // main content

  await scrollPage(page);

  await page.waitForSelector('#site-content'); // main content
  await page.waitForSelector('#site-content [itemprop="itemListElement"]'); // rooms
  await page.waitForSelector('.cn6uggc');     // navigation bar
  // await page.waitForSelector('_ar9stc');      // footer

  const items = await page.$$('#site-content [itemprop="itemListElement"]'); // rooms list as items
  await parseRooms(items, location);
};

export default loadPage;
