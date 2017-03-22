import path from 'path';
import {app} from 'electron';

const APP_DATA_PATH = path.resolve(app.getPath('appData'), 'garchen-panel');

export default APP_DATA_PATH;
