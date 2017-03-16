import {app, screen, BrowserWindow} from 'electron';

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
