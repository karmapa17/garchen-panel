import {dialog} from 'electron';
import {isEmpty, first} from 'lodash';
import csv from 'fast-csv';
import fs from 'fs';
import {basename} from 'path';
import log from 'karmapa-log';
import sleep from 'sleep-promise';
import shortid from 'shortid';

import csvProcessor, {FIELD_PAGE_NUM} from './../../utils/csvProcessor';
import pageNumToFloat from './../../utils/pageNumToFloat';
import FRACTION_LENGTH from './../../constants/fractionLength';
import now from './../../utils/now';
import Reporter from './../../utils/Reporter';

const reportDuration = 1000;
const reporter = new Reporter();

const numberConcurrentWrite = 50000;
const dialogOptions = {
  properties: ['openFile'],
  filters: [
    {name: 'Csv Files', extensions: ['csv']}
  ]
};

export default async function addFolderByCsv(event, data) {

  const {models, importEmitter, db} = this.params;
  const {Folder} = models;
  const {broadcast, resolve, reject} = this;

  dialog.showOpenDialog(dialogOptions, handleDialogOpen);

  function processCsv(csvFilePath) {

    let cancelImporting = false;
    importEmitter.removeAllListeners();

    importEmitter.once('cancel-importing', () => {
      cancelImporting = true;
    });

    const filename = basename(csvFilePath);
    const stream = fs.createReadStream(csvFilePath);

    let completedLines = 0;
    let hasColumnRow = false;
    let folder = null;
    let fields = [];
    let currentEntryDatum = null;
    let entryData = [];

    async function handleData(data) {

      let createdEntryDatum = null;

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
          createdEntryDatum = currentEntryDatum;
        }
        else if (currentEntryDatum) {
          currentEntryDatum.data = csvProcessor.appendData(data, currentEntryDatum.data, fields);
        }
      }
      ++completedLines;
      reporter.report(() => {
        broadcast('csv-processing-status', {completedLines});
      }, reportDuration);

      if (createdEntryDatum) {
        return createdEntryDatum;
      }
    }

    async function batchInsertIfNeeded(entryDatum) {

      if (entryDatum) {
        entryData.push(entryDatum);

        if (entryData.length > (numberConcurrentWrite + 1)) {

          const insertQuery = getEntryBatchInsertQuery(db, entryData.slice(0, entryData.length - 1));

          return db.raw(insertQuery)
            .then(() => {
              // put the last one to new array
              entryData = [entryData.pop()];
            });
        }
      }
    }

    function done() {
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
