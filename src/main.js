import {app, screen, BrowserWindow, ipcMain} from 'electron';
import path from 'path';
import Trilogy from 'trilogy';

import mkdirp from './main/helpers/mkdirp';
import ipcDecorator from './main/helpers/ipcDecorator';
import APP_DATA_PATH from './main/constants/appDataPath';

import listFolders from './main/controllers/folder/listFolders';


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

  ipc.on('GET /folders', listFolders);
}
