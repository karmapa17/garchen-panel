import {dialog} from 'electron';
import {isEmpty} from 'lodash';
import csv from 'fast-csv';
import fs from 'fs';
import log from 'karmapa-log';
import shortid from 'shortid';

import csvProcessor from './../../utils/csvProcessor';

export default async function exportFolderToCsv(event, data) {

  const {models, importEmitter} = this.params;
  const {Folder, Entry} = models;
  const {broadcast, resolve, reject} = this;
  const {writeDelay, folderId} = data;

  const folder = await Folder.findOne({id: folderId});
  const csvHeaders = csvProcessor.getCsvHeaders(folder);
  const filename = `${folder.name}.csv`;

  const options = {
    title: 'Choose CSV Export Path',
    defaultPath: filename
  };

  dialog.showSaveDialog(options, handleDialogSave);

  async function writeCsv(savePath) {

    const csvStream = csv.createWriteStream({headers: csvHeaders});
    const writableStream = fs.createWriteStream(savePath);
    const size = 50000;

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
