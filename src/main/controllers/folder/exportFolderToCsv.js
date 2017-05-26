import {dialog} from 'electron';
import {isEmpty, first} from 'lodash';
import csv from 'fast-csv';
import fs from 'fs';
import {basename} from 'path';
import log from 'karmapa-log';
import sleep from 'sleep-promise';
import shortid from 'shortid';

import csvProcessor from './../../helpers/csvProcessor';

export default async function exportFolderToCsv(event, data) {

  const {models, importEmitter} = this.params;
  const {Folder, Entry} = models;
  const {broadcast, resolve, reject} = this;
  const {writeDelay, folderId} = data;

  const folder = await Folder.findOne({id: folderId});
  const filename = `${folder.name}.csv`;

  const options = {
    title: 'Choose CSV Export Path',
    defaultPath: filename
  };

  dialog.showSaveDialog(options, handleDialogSave);

  async function writeCsv(savePath) {

    const csvStream = csv.createWriteStream({headers: true});
    const writableStream = fs.createWriteStream(savePath);
    const size = 100;

    let entries = [];
    let offset = 0;

    csvStream.pipe(writableStream);

    do {
      entries = await Entry.find({folderId}, {skip: offset, limit: size, order: 'id'}) || [];
      for (const entry of entries) {
        const rows = csvProcessor.getCsvRowsByEntry({folder, entry});
        rows.forEach((row) => csvStream.write(row));
      }
      offset += size;
    }
    while (entries.length > 0);

    writableStream.on('finish', () => resolve({message: 'done'}));
    csvStream.end();
  }

  function handleDialogSave(savePath) {

    if (isEmpty(savePath)) {
      resolve({message: 'User did not choose csv export path'});
      return;
    }

    writeCsv(savePath)
      .catch((err) => log.error(err));
  }
}
