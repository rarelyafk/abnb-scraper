import { existsSync, appendFileSync } from 'fs';

const parseRooms = async (items, location) => {
  console.log('  parsing rooms');

  const fileName = location.replaceAll(',', '').replaceAll(' ', '_');
  const filePath = `./csvs/${fileName}.csv`;

  const csvAppend = line => {
    const errFunc = err => { if (err) throw err; };
    appendFileSync(filePath, line, errFunc);
  };

  if (!(existsSync(filePath))) {
    csvAppend(`sep=;\n`);
    csvAppend(`reviews;stars;price;room_type;neighborhood;link;id\n`);
  }

  const getVal = async (JSH, prop = 'innerText') => {
    const propVal = await JSH.getProperty(prop);
    return await propVal.jsonValue();
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
        const stars = Array.from(review.match(/(.*) /))[1];
        const numOfReviews = Array.from(review.match(/\((.*)\)/))[1];
        const price = priceVal.slice(0, -1);
        const roomType = neighborhoodText.split(' in ')[0];
        const neighborhood = neighborhoodText.split(' in ')[1];
        const id = roomUrl.match(/rooms\/(.*)\?/)[1];

        const line = `${numOfReviews};${stars};${price};${roomType};${neighborhood};${roomUrl};${id}\n`;

        csvAppend(line);
        itemCnt++;
      }
    }
  }
  console.log(`  wrote ${itemCnt} (out of ${items.length}) rooms to ${fileName}`);
};

export default parseRooms;
