import {app, screen, BrowserWindow, ipcMain} from 'electron';
import path from 'path';
import Trilogy from 'trilogy';

import mkdirp from './main/helpers/mkdirp';
import ipcDecorator from './main/helpers/ipcDecorator';
import APP_DATA_PATH from './main/constants/appDataPath';

import listFolders from './main/controllers/folder/listFolders';
import addFolder from './main/controllers/folder/addFolder';

import initDb from './main/models';

let mainWindow = null;

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', handleAppReady);

async function handleAppReady() {

  const {width, height} = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({width, height});

  mainWindow.on('close', (event) => {
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  const {models} = await initDb();
  const ipc = ipcDecorator.decorate(ipcMain, {models});

  ipc.on('GET /folders', listFolders);
  ipc.on('POST /folders', addFolder);
}
