import test from 'ava';

import ipc from './../../src/utils/ipc';

const electron = window.require('electron');
const {ipcRenderer, ipcMain} = electron;

test('ipc should be able to send empty data and get fulfilled data back', async (t) => {

  const eventName = 'ipc-send-empty-data-fulfill';

  ipcMain.once(eventName, (event, args) => {
    const id = args._id;
    delete args._id;
    event.sender.send(`${eventName}::${id}`, args);
  });

  t.deepEqual(await ipc.send(eventName), {});
});

test('ipc should be able to send data and get fulfilled data back', async (t) => {

  const data = {testing: true};
  const eventName = 'ipc-send-fulfill';

  ipcMain.once(eventName, (event, args) => {
    const id = args._id;
    delete args._id;
    event.sender.send(`${eventName}::${id}`, args);
  });

  t.deepEqual(await ipc.send(eventName, data), data);
});

test('ipc should be able to send data and get rejected error back', async (t) => {

  const data = {testing: true};
  const eventName = 'ipc-send-reject';

  ipcMain.once(eventName, (event, args) => {
    const id = args._id;
    delete args._id;
    args._error = true;
    event.sender.send(`${eventName}::${id}`, args);
  });

  const error = await t.throws(ipc.send(eventName, data))
  t.deepEqual(error, data);
});

test('ipc should be able to register event', async (t) => {

  const eventName = 'ipc-on';
  ipc.on(eventName, () => {});

  const nameInEmitter = ipcRenderer._emitter.eventNames()
    .filter((name) => name === eventName)[0];

  t.is(eventName, nameInEmitter);
});

test('ipc should be able to de-register event', async (t) => {

  const eventName = 'ipc-off';
  const cb = () => {};
  ipc.on(eventName, cb);
  ipc.off(eventName, cb);

  const nameInEmitter = ipcRenderer._emitter.eventNames()
    .filter((name) => name === eventName)[0];

  t.not(eventName, nameInEmitter);
});
