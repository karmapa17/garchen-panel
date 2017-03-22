import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import {APP_DATA_PATH} from './../constants';

const basename = path.basename(module.filename);
const db = {};

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

if (':memory:' !== config.storage) {
  config.storage = path.resolve(APP_DATA_PATH, config.storage);
  console.log('where is this', config.storage);
}

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
}
else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (0 !== file.indexOf('.')) && (file !== basename) && ('.js' === file.slice(-3));
  })
  .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
