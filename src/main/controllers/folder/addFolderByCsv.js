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

const NUMBER_CONCURRNT_WRITE = 5000;

export default async function addFolderByCsv(event, data) {

  const {models, importEmitter} = this.params;
  const {Folder, Entry} = models;
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
    let currentEntry = null;

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

          await sleep(writeDelay);
          currentEntry = await Entry.create({
            folderId: folder.id,
            sourceEntry,
            pageNum,
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

      const seconds = parseInt((+new Date() - timeStart) / 1000, 10);
      const linesPerSecond = Math.floor(completedLines / seconds);
      broadcast('csv-processing-status', {completedLines, linesPerSecond});
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
    broadcast('csv-processing-start');
    const csvFilePath = first(paths);
    processCsv(csvFilePath);
  }
}
