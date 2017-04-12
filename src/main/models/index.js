import Trilogy from 'trilogy';
import path from 'path';
import fs from 'fs';
import log from 'karmapa-log';

import APP_DATA_PATH from './../constants/appDataPath';

const dbPath = path.resolve(APP_DATA_PATH, 'garchen-panel.db');

try {
  fs.closeSync(fs.openSync(dbPath, 'wx'));
  log.info('Created db file.');
}
catch (err) {
  log.info('DB file already existed, skip creating file.');
}

const db = new Trilogy(dbPath, {client: 'sql.js'});

fs.readdirSync(__dirname)
  .filter((filename) => (0 !== filename.indexOf('.')) && ('index.js' !== filename))
  .forEach((filename) => {
    const model = require(path.resolve(__dirname, filename));
    db.model(model.name, model.schema);
  });

export default db;
