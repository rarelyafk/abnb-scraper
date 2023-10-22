import {
  getFilePathAndInit,
  csvAppend,
} from '../../csvWriter/index.mjs';


const parseRooms = async (items, location) => {
  const filePath = getFilePathAndInit(location);
  console.log('  parsing rooms');

  const getVal = async (JSH, prop = 'innerText') => {
    const propVal = await JSH.getProperty(prop);
    const jsonVal = await propVal.jsonValue();
    return jsonVal;
  }

  let itemCnt = 0;
  for (const item of items) {
    // JSH = JSHandle
    const priceJSH = await item.$('._1y74zjx');
    const reviewJSH = await item.$('.r1dxllyb');
    const roomJSH = await item.$('.rfexzly');
    const neighborhoodJSH = await item.$('.t1jojoys');

    if (priceJSH && reviewJSH && roomJSH && neighborhoodJSH) {
      const priceVal = await getVal(priceJSH);
      const roomUrl = await getVal(roomJSH, 'href');
      const review = await getVal(reviewJSH);
      const neighborhoodText = await getVal(neighborhoodJSH);

      if (review !== 'New') {
        const numOfReviews = Array.from(review.match(/\((.*)\)/))[1];
        const stars = Array.from(review.match(/(.*) /))[1];
        const price = priceVal.slice(0, -1);
        const roomType = neighborhoodText.split(' in ')[0];
        const neighborhood = neighborhoodText.split(' in ')[1];
        const id = roomUrl.match(/rooms\/(.*)\?/)[1];

        const line = `${numOfReviews};${stars};${price};${roomType};${neighborhood};${roomUrl};${id}\n`;

        csvAppend(filePath, line);
        itemCnt++;
      }
    }
  }
  console.log(`  wrote ${itemCnt} (out of ${items.length}) rooms to ${filePath}`);
};

export default parseRooms;


// const FS = ';';
// numOfReviews + FS +
// stars + FS +
// price + FS +
// roomType + FS +
// neighborhood + FS +
// roomUrl + FS +
// id + FS +
// `\n`
