import {app, screen, BrowserWindow, ipcMain} from 'electron';
import path from 'path';

import {mkdirp, ipcDecorator} from './main/helpers';
import {APP_DATA_PATH} from './main/constants';

import * as folder from './main/controllers/folder';

let mainWindow = null;

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', handleAppReady);

function handleAppReady() {

  const {width, height} = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({width, height});

  mainWindow.on('close', (event) => {
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  const ipc = ipcDecorator.decorate(ipcMain);

  ipc.on('GET /folders', folder.listFolders);
}
