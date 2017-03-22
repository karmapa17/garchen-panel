const ipcRenderer = window.require('electron').ipcRenderer;
const crypto = window.require('crypto');

export default class ipc {

  static events = [];

  static send(name, data = {}) {
    return new Promise((resolve, reject) => {
      const id = crypto.randomBytes(48).toString('hex');
      data._id = id;
      ipcRenderer.send(name, data);
      ipcRenderer.once(`${name}::${id}`, (event, data) => {
        return data._error ? reject(data) : resolve(data);
      });
    });
  }

  static on(name, cb) {
    ipcRenderer.on(name, cb);
  }

  static off(name, cb) {
    ipcRenderer.removeListener(name, cb);
  }
}
