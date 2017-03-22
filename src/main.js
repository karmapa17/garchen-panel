import {app, screen, BrowserWindow, ipcMain} from 'electron';
import path from 'path';

import {mkdirp, ipcDecorator} from './main/helpers';
import {APP_DATA_PATH} from './main/constants';

import * as folder from './main/controllers/folder';

const sqlite3 = require('sqlite3').verbose();
const dbPath = path.resolve(APP_DATA_PATH, 'garchen.sqlite3');
const db = new sqlite3.Database(dbPath);

const ipc = ipcDecorator.decorate(ipcMain);

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
