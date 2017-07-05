import {app, screen, BrowserWindow, ipcMain, Menu} from 'electron';
import path from 'path';
import Trilogy from 'trilogy';
import EventEmitter from 'events';

import mkdirp from './helpers/mkdirp';
import IpcDecorator from './helpers/IpcDecorator';
import APP_DATA_PATH from './constants/appDataPath';

import getAppVersion from './controllers/app/getAppVersion';
import getFolder from './controllers/folder/getFolder';
import updateFolder from './controllers/folder/updateFolder';
import listFolders from './controllers/folder/listFolders';
import listFolderEntries from './controllers/entry/listFolderEntries';
import addFolderEntry from './controllers/entry/addFolderEntry';
import checkFolderEntryExists from './controllers/entry/checkFolderEntryExists';
import addFolder from './controllers/folder/addFolder';
import markDeletedAtToFolders from './controllers/folder/markDeletedAtToFolders';
import deleteFolders from './controllers/folder/deleteFolders';
import checkFolderExists from './controllers/folder/checkFolderExists';
import addFolderByCsv from './controllers/folder/addFolderByCsv';
import cancelImportingCsv from './controllers/folder/cancelImportingCsv';
import exportFolderToCsv from './controllers/folder/exportFolderToCsv';
import clearRecycleBin from './controllers/folder/clearRecycleBin';
import openExternal from './controllers/common/openExternal';
import restoreFolders from './controllers/folder/restoreFolders';

import getEntry from './controllers/entry/getEntry';
import deleteEntries from './controllers/entry/deleteEntries';
import updateEntry from './controllers/entry/updateEntry';
import getMenuTemplate from './helpers/getMenuTemplate';
import crossFolderSearch from './controllers/entry/crossFolderSearch';

import login from './controllers/auth/login';

import initDb from './models';

require('electron-debug')({enabled: true});
require('electron-context-menu')({
  labels: {
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    save: 'Save',
    copyLink: 'Copy Link',
    inspect: 'Inspect'
  }
});

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

  mainWindow.loadURL('file://' + __dirname + '/../splash.html');

  const {db, models} = await initDb();
  const importEmitter = new EventEmitter();
  const ipc = IpcDecorator.decorate(ipcMain, {db, models, importEmitter});

  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()));

  ipc.on('get-folder', getFolder);
  ipc.on('check-folder-exists', checkFolderExists);
  ipc.on('update-folder', updateFolder);
  ipc.on('mark-deleted-at-to-folders', markDeletedAtToFolders);
  ipc.on('delete-folders', deleteFolders);
  ipc.on('list-folders', listFolders);
  ipc.on('add-folder', addFolder);
  ipc.on('add-folder-by-csv', addFolderByCsv);
  ipc.on('cancel-importing-csv', cancelImportingCsv);
  ipc.on('export-folder-to-csv', exportFolderToCsv);
  ipc.on('clear-recycle-bin', clearRecycleBin);
  ipc.on('restore-folders', restoreFolders);

  ipc.on('list-folder-entries', listFolderEntries);
  ipc.on('add-folder-entry', addFolderEntry);
  ipc.on('check-folder-entry-exists', checkFolderEntryExists);
  ipc.on('cross-folder-search', crossFolderSearch);

  ipc.on('get-entry', getEntry);
  ipc.on('delete-entries', deleteEntries);
  ipc.on('update-entry', updateEntry);

  ipc.on('login', login);
  ipc.on('open-external', openExternal);
  ipc.on('get-app-version', getAppVersion);
}
