import fs from 'fs';

const parseRooms = async (items, location) => {
  console.log('  parsing rooms');
  const fileName = location.replaceAll(',', '').replaceAll(' ', '_');
  const filePath = `./csvs/${fileName}.csv`;
  if (!(fs.existsSync(filePath)))
    fs.appendFile(
      filePath,
      `reviews;stars;price;room_type;neighborhood;link\n`,
      err => { if (err) throw err },
    );

  let itemCnt = 0;
  for (const item of items) {
    const priceJSHandle = await item.$('._1y74zjx');
    const reviewJSHandle = await item.$('.r1dxllyb');
    const roomJSHandle = await item.$('.rfexzly');
    const neighborhoodJSHandle = await item.$('.t1jojoys');

    if (priceJSHandle && reviewJSHandle && roomJSHandle && neighborhoodJSHandle) {
      const priceProperty = await priceJSHandle.getProperty('innerText');
      const price = await priceProperty.jsonValue();
      const roomProperty = await roomJSHandle.getProperty('href');
      const roomUrl = await roomProperty.jsonValue();
      const reviewProperty = await reviewJSHandle.getProperty('innerText');
      const review = await reviewProperty.jsonValue();
      const neighborhoodProperty = await neighborhoodJSHandle.getProperty('innerText');
      const neighborhoodText = await neighborhoodProperty.jsonValue();

      if (review !== 'New') {
        const stars = Array.from(review.match(/(.*) /))[1];
        const numOfReviews = Array.from(review.match(/\((.*)\)/))[1];
        const roomType = neighborhoodText.split(' in ')[0];
        const neighborhood = neighborhoodText.split(' in ')[1];
        const id = roomUrl.match(/rooms\/(.*)\?/)[1];

        // const line = `${numOfReviews};${stars};${price.slice(0,-1)};${roomType};${neighborhood};=HYPERLINK("${roomUrl}","${id}") \n`;
        const line = `${numOfReviews};${stars};${price.slice(0,-1)};${roomType};${neighborhood};${roomUrl}\n`;
        // console.log(line);
        // console.log({ numOfReviews, stars, price, roomType, neighborhood, id, roomUrl, url, line });

        fs.appendFile(
          `./csvs/${fileName}.csv`,
          line,
          err => { if (err) throw err },
        );
        itemCnt++;
      }
    }
  }
  console.log(`  wrote ${itemCnt} (out of ${items.length}) rooms to ${fileName}`);
};

export default parseRooms;
