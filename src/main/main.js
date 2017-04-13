import {app, screen, BrowserWindow, ipcMain} from 'electron';
import path from 'path';
import Trilogy from 'trilogy';

import mkdirp from './helpers/mkdirp';
import ipcDecorator from './helpers/ipcDecorator';
import APP_DATA_PATH from './constants/appDataPath';

import getFolder from './controllers/folder/getFolder';
import updateFolder from './controllers/folder/updateFolder';
import listFolders from './controllers/folder/listFolders';
import addFolder from './controllers/folder/addFolder';

import initDb from './models';

require('electron-debug')({showDevTools: true});

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

  mainWindow.loadURL('file://' + __dirname + '/../index.html');

  const {models} = await initDb();
  const ipc = ipcDecorator.decorate(ipcMain, {models});

  ipc.on('GET /folder', getFolder);
  ipc.on('PUT /folder', updateFolder);
  ipc.on('GET /folders', listFolders);
  ipc.on('POST /folders', addFolder);
}
