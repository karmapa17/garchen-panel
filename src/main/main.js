import {app, screen, BrowserWindow, ipcMain} from 'electron';
import path from 'path';
import Trilogy from 'trilogy';

import mkdirp from './helpers/mkdirp';
import ipcDecorator from './helpers/ipcDecorator';
import APP_DATA_PATH from './constants/appDataPath';

import getFolder from './controllers/folder/getFolder';
import updateFolder from './controllers/folder/updateFolder';
import listFolders from './controllers/folder/listFolders';
import listFolderEntries from './controllers/folderEntry/listFolderEntries';
import addFolder from './controllers/folder/addFolder';
import deleteFolder from './controllers/folder/deleteFolder';
import checkFolderExists from './controllers/folder/checkFolderExists';

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
  ipc.on('GET /folder/exists', checkFolderExists);
  ipc.on('GET /folder/entries', listFolderEntries);
  ipc.on('PUT /folder', updateFolder);
  ipc.on('DELETE /folder', deleteFolder);

  ipc.on('GET /folders', listFolders);
  ipc.on('POST /folders', addFolder);
}
