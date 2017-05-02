import {dialog} from 'electron';
import {isEmpty, first} from 'lodash';
import csv from 'fast-csv';
import fs from 'fs';

export default async function addFolderByCsv({models}) {

  const {Folder} = models;

  const options = {
    properties: ['openFile'],
    filters: [
      {name: 'Csv Files', extensions: ['csv']}
    ]
  };

  dialog.showOpenDialog(options, (paths) => {

    if (isEmpty(paths)) {
      return;
    }

    const csvFilePath = first(paths);
    const stream = fs.createReadStream(csvFilePath);

    const csvStream = csv()
      .on('data', (data) => {
        console.log(data);
      })
     .on('end', () => {
       console.log("done");
     });

    stream.pipe(csvStream);

    console.log('csvFilePath', csvFilePath);
  });
}
