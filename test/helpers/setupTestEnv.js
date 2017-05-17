require('babel-register');
require('babel-polyfill');
require('mock-local-storage');

const noop = () => null;

global.document = require('jsdom').jsdom('<body></body>');
global.window = document.defaultView;
global.navigator = window.navigator;

require.extensions['.scss'] = noop;

const {ipcRenderer, ipcMain} = require('electron-ipc-mock')();

window.require = (path) => {
  const data = {
    electron: {
      ipcRenderer,
      ipcMain
    },
    crypto: require('crypto')
  };
  return data[path];
};
