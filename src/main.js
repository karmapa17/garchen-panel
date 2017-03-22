import {app, screen, BrowserWindow, ipcMain} from 'electron';
import path from 'path';

import {mkdirp, ipcDecorator} from './main/helpers';
import {APP_DATA_PATH} from './main/constants';
import {sequelize} from './main/models';

import * as folder from './main/controllers/folder';

const ipc = ipcDecorator.decorate(ipcMain);

sequelize.sync()
  .then(init);

function init() {

  let mainWindow = null;

  app.on('window-all-closed', () => {
    app.quit();
  });

  app.on('ready', () => {

    const {width, height} = screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({width, height});

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.on('close', (event) => {
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  });

  ipc.on('GET /folders', folder.listFolders);
}
