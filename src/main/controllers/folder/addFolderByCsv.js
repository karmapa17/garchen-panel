import {dialog} from 'electron';
import {isEmpty, first} from 'lodash';
import csv from 'fast-csv';
import fs from 'fs';
import {basename} from 'path';

import csvProcessor from './../../helpers/csvProcessor';

export default async function addFolderByCsv(args) {

  const {models, webContents} = args;
  const send = webContents.send.bind(webContents);
  const {Folder} = models;

  const options = {
    properties: ['openFile'],
    filters: [
      {name: 'Csv Files', extensions: ['csv']}
    ]
  };

  dialog.showOpenDialog(options, handleDialogOpen);

  async function handleDialogOpen(paths) {

    if (isEmpty(paths)) {
      return;
    }

    send('start-processing-csv');

    const csvFilePath = first(paths);
    const filename = basename(csvFilePath);
    const stream = fs.createReadStream(csvFilePath);

    let completedLines = 0;
    let hasColumnRow = false;
    let folder = null;
    let fields = [];

    const csvStream = csv()
      .on('data', async (data) => {

        if (isEmpty(folder) && csvProcessor.isColumnRow(data)) {
          const columnData = csvProcessor.getColumnData(data);
          folder = await Folder.create({
            name: filename,
            data: columnData
          });
          fields = csvProcessor.getFields(data);
        }
        else if (folder) {
        }

        if (0 === (++completedLines % 20000)) {
          send('csv-processing-status', {completedLines});
        }
      })
     .on('end', () => {

       if (! hasColumnRow) {
         send('csv-processing-error', {message: 'No column row detected'});
         return;
       }

       send('csv-processing-status', {completedLines});
       send('csv-processing-end');
     });

    stream.pipe(csvStream);
  }
}
