import Trilogy from 'trilogy';
import appDataPath from './appDataPath';
import path from 'path';

export default new Trilogy(path.resolve(appDataPath, 'garchen-panel.db'), {
  client: 'sql.js'
});
