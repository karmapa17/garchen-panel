import Trilogy from 'trilogy';
import path from 'path';
import fs from 'fs';
import log from 'karmapa-log';
import {indexBy, prop} from 'ramda';
import {isArray} from 'lodash';

import APP_DATA_PATH from './../constants/appDataPath';

// if db version change, user will have to convert their db via online tool
const dbVersion = '0.0.11';

export default async function initDb() {

  const dbPath = path.resolve(APP_DATA_PATH, `garchen-panel-${dbVersion}.db`);

  try {
    fs.closeSync(fs.openSync(dbPath, 'wx'));
    log.info('Created db file.');
  }
  catch (err) {
    log.info('DB file already existed, skip creating file.');
  }

  const options = {client: 'sqlite3'};

  if ('development' === process.env.LOG_QUERY) {
    options.verbose = (sql) => log.info(`sql: ${sql}`);
  }

  const db = new Trilogy(dbPath, options);

  const promises = fs.readdirSync(__dirname)
    .filter((filename) => (0 !== filename.indexOf('.')) && ('index.js' !== filename))
    .map((filename) => {
      const {name, schema, options} = require(path.resolve(__dirname, filename));
      return db.model(name, schema, options);
    });

  const models = indexBy(prop('name'), (await Promise.all(promises)));
  return {db, models};
}
