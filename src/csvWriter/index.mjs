import { existsSync, appendFileSync } from 'fs';


const csvAppend = (filePath, line) => {
  const errFunc = err => { if (err) throw err; };
  appendFileSync(filePath, line, errFunc);
};

const getFilePathAndInit = location => {
  const fileName = location.replaceAll(',', '').replaceAll(' ', '_');
  const filePath = `./csvs/${fileName}.csv`;

  if (!(existsSync(filePath))) {
    csvAppend(filePath, `sep=;\n`);
    csvAppend(filePath, `reviews;stars;price;room_type;neighborhood;link;id\n`);
  }

  return filePath;
};


export {
  csvAppend,
  getFilePathAndInit,
};
