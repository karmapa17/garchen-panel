import {dialog} from 'electron';
import {isEmpty, first} from 'lodash';
import csv from 'fast-csv';
import fs from 'fs';
import {basename} from 'path';
import log from 'karmapa-log';

import csvProcessor from './../../helpers/csvProcessor';

export default async function addFolderByCsv(args) {

  const {models, webContents} = args;
  const send = webContents.send.bind(webContents);
  const {Folder, Entry} = models;

  const options = {
    properties: ['openFile'],
    filters: [
      {name: 'Csv Files', extensions: ['csv']}
    ]
  };

  dialog.showOpenDialog(options, handleDialogOpen);

  function processCsv(csvFilePath) {

    const filename = basename(csvFilePath);
    const stream = fs.createReadStream(csvFilePath);

    let completedLines = 0;
    let hasColumnRow = false;
    let folder = null;
    let fields = [];
    let currentEntry = null;

    async function handleData(data) {

      if (isEmpty(folder) && csvProcessor.isColumnRow(data)) {
        const columnData = csvProcessor.getColumnData(data);
        folder = await Folder.create({
          name: filename,
          data: columnData
        });
        fields = csvProcessor.getFields(data);
        hasColumnRow = true;
      }
      else if (folder) {

        const rowData = csvProcessor.getRowDataByFields(data, fields);
        const {sourceEntry} = rowData;

        if (sourceEntry) {

          delete rowData.sourceEntry;

          currentEntry = await Entry.create({
            folderId: folder.id,
            sourceEntry,
            data: rowData
          });
        }
        else if (currentEntry) {
          const newData = csvProcessor.appendData(data, currentEntry.data, fields);
          const rowsAffected = await Entry.update({id: currentEntry.id}, {data: newData});

          if (rowsAffected) {
            currentEntry.data = newData;
          }
        }
      }

      if (0 === (++completedLines % 300)) {
        send('csv-processing-status', {completedLines});
      }
    }

    csv.fromStream(stream)
      .validate((data, next) => {
        handleData(data)
          .then(() => next(null, true))
          .catch((err) => next(err));
      })
      .on('data', () => {})
      .on('error', (err) => {
        log.error(err);
        send('csv-processing-error', {message: `${err}`});
      })
      .on('end', () => {

        if (! hasColumnRow) {
          send('csv-processing-error', {message: 'No column row detected'});
          return;
        }

        send('csv-processing-status', {completedLines});
        send('csv-processing-end');
      });
  }

  function handleDialogOpen(paths) {

    if (isEmpty(paths)) {
      return;
    }

    const csvFilePath = first(paths);
    send('start-processing-csv');

    setTimeout(() => processCsv(csvFilePath), 500);
  }
}
