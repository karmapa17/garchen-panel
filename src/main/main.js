import {app, screen, BrowserWindow, ipcMain, Menu} from 'electron';
import path from 'path';
import Trilogy from 'trilogy';

import mkdirp from './helpers/mkdirp';
import IpcDecorator from './helpers/IpcDecorator';
import APP_DATA_PATH from './constants/appDataPath';

import getFolder from './controllers/folder/getFolder';
import updateFolder from './controllers/folder/updateFolder';
import listFolders from './controllers/folder/listFolders';
import listFolderEntries from './controllers/entry/listFolderEntries';
import addFolderEntry from './controllers/entry/addFolderEntry';
import checkFolderEntryExists from './controllers/entry/checkFolderEntryExists';
import addFolder from './controllers/folder/addFolder';
import deleteFolder from './controllers/folder/deleteFolder';
import checkFolderExists from './controllers/folder/checkFolderExists';

import getEntry from './controllers/entry/getEntry';
import deleteEntries from './controllers/entry/deleteEntries';
import updateEntry from './controllers/entry/updateEntry';
import getMenuTemplate from './helpers/getMenuTemplate';

import login from './controllers/auth/login';

import initDb from './models';

require('electron-debug')({enabled: true});

let mainWindow = null;

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', handleAppReady);

async function handleAppReady() {

  const {width, height} = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({width, height});

  const {webContents} = mainWindow;

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.loadURL('file://' + __dirname + '/../index.html');

  const {db, models} = await initDb();
  const ipc = IpcDecorator.decorate(ipcMain, {db, models});

  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()));

  ipc.on('get-folder', getFolder);
  ipc.on('check-folder-exists', checkFolderExists);
  ipc.on('update-folder', updateFolder);
  ipc.on('delete-folder', deleteFolder);
  ipc.on('list-folders', listFolders);
  ipc.on('add-folder', addFolder);

  ipc.on('list-folder-entries', listFolderEntries);
  ipc.on('add-folder-entry', addFolderEntry);
  ipc.on('check-folder-entry-exists', checkFolderEntryExists);

  ipc.on('get-entry', getEntry);
  ipc.on('delete-entries', deleteEntries);
  ipc.on('update-entry', updateEntry);

  ipc.on('login', login);
}
