import {dialog} from 'electron';
import {isEmpty, first} from 'lodash';
import csv from 'fast-csv';
import fs from 'fs';
import {basename} from 'path';
import log from 'karmapa-log';
import sleep from 'sleep-promise';
import shortid from 'shortid';

import csvProcessor, {FIELD_PAGE_NUM} from './../../helpers/csvProcessor';
import pageNumToFloat from './../../helpers/pageNumToFloat';
import FRACTION_LENGTH from './../../constants/fractionLength';

const NUMBER_CONCURRNT_WRITE = 50000;
const options = {
  properties: ['openFile'],
  filters: [
    {name: 'Csv Files', extensions: ['csv']}
  ]
};

export default async function addFolderByCsv(event, data) {

  const {models, importEmitter, db} = this.params;
  const {Folder} = models;
  const {broadcast, resolve, reject} = this;

  dialog.showOpenDialog(options, handleDialogOpen);

  function processCsv(csvFilePath) {

    let cancelImporting = false;
    importEmitter.removeAllListeners();

    importEmitter.once('cancel-importing', () => {
      cancelImporting = true;
    });

    const filename = basename(csvFilePath);
    const stream = fs.createReadStream(csvFilePath);
    const timeStart = +new Date();

    let completedLines = 0;
    let hasColumnRow = false;
    let folder = null;
    let fields = [];
    let currentEntryDatum = null;
    let entryData = [];

    async function handleData(data) {

      if (cancelImporting) {
        return Promise.reject('User stopped importing');
      }

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
        const pageNum = pageNumToFloat(rowData[FIELD_PAGE_NUM], FRACTION_LENGTH) || '';

        if (sourceEntry) {

          delete rowData.sourceEntry;
          delete rowData[FIELD_PAGE_NUM];

          currentEntryDatum = {
            folderId: folder.id,
            sourceEntry,
            pageNum,
            data: rowData
          };

          return currentEntryDatum;
        }

        if (currentEntryDatum) {
          currentEntryDatum.data = csvProcessor.appendData(data, currentEntryDatum.data, fields);
        }
      }
    }

    async function batchInsertIfNeeded(entryDatum) {

      if (entryDatum) {
        entryData.push(entryDatum);

        if (entryData.length > (NUMBER_CONCURRNT_WRITE + 1)) {

          const insertQuery = getEntryBatchInsertQuery(db, entryData.slice(0, entryData.length - 1));

          return db.raw(insertQuery)
            .then(() => {
              completedLines += entryData.length - 1;
              const seconds = parseInt((+new Date() - timeStart) / 1000, 10);
              const linesPerSecond = Math.floor(completedLines / seconds);
              broadcast('csv-processing-status', {completedLines, linesPerSecond});
              entryData = [entryData.pop()];
            });
        }
      }
    }

    function done() {
      broadcast('csv-processing-status', {completedLines});
      broadcast('csv-processing-done', {filename});
      resolve({message: 'done'});
    }

    csv.fromStream(stream)
      .validate((data, next) => {

        handleData(data)
          .then((entryDatum) => batchInsertIfNeeded(entryDatum))
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

        // finish the rest
        if (entryData.length > 0) {
          const insertQuery = getEntryBatchInsertQuery(db, entryData);
          db.raw(insertQuery)
            .then(done);
        }
        else {
          done();
        }
      });
  }

  function handleDialogOpen(paths) {

    if (isEmpty(paths)) {
      resolve({message: 'User did not choose csv file'});
      return;
    }
    broadcast('csv-processing-start');
    const csvFilePath = first(paths);
    processCsv(csvFilePath);
  }
}

function getEntryBatchInsertQuery(db, entryData) {
  const formattedData = entryData.map((row) => ({...row, data: JSON.stringify(row.data)}));
  return db.knex.batchInsert('Entry', formattedData, 200);
}
