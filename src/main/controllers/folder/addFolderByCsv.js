import {dialog} from 'electron';
import {isEmpty, first} from 'lodash';
import csv from 'fast-csv';
import fs from 'fs';
import {basename} from 'path';
import log from 'karmapa-log';
import sleep from 'sleep-promise';
import shortid from 'shortid';

import csvProcessor from './../../helpers/csvProcessor';

export default async function addFolderByCsv(event, data) {

  const {Folder, Entry} =  this.params.models;
  const {broadcast, resolve, reject} = this;
  const {writeDelay} = data;

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
          name: `${filename} - ${shortid.generate()}`,
          data: columnData
        });
        broadcast('csv-folder-created', {folderId: folder.id});
        fields = csvProcessor.getFields(data);
        hasColumnRow = true;
      }
      else if (folder) {

        const rowData = csvProcessor.getRowDataByFields(data, fields);
        const {sourceEntry} = rowData;

        if (sourceEntry) {

          delete rowData.sourceEntry;

          await sleep(writeDelay);
          currentEntry = await Entry.create({
            folderId: folder.id,
            sourceEntry,
            data: rowData
          });
        }
        else if (currentEntry) {
          const newData = csvProcessor.appendData(data, currentEntry.data, fields);
          await sleep(writeDelay);
          const rowsAffected = await Entry.update({id: currentEntry.id}, {data: newData});

          if (rowsAffected) {
            currentEntry.data = newData;
          }
        }
      }
      ++completedLines;
      broadcast('csv-processing-status', {completedLines});
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
        reject({message: `${err}`});
      })
      .on('end', () => {

        if (! hasColumnRow) {
          reject({messageId: 'no-column-row-detected', filename});
          return;
        }

        broadcast('csv-processing-status', {completedLines});
        broadcast('csv-processing-done', {filename});
        resolve({message: 'done'});
      });
  }

  function handleDialogOpen(paths) {

    if (isEmpty(paths)) {
      resolve({message: 'User did not choose csv file'});
      return;
    }

    const csvFilePath = first(paths);
    processCsv(csvFilePath);
  }
}
