import test from 'ava';
import zhTwMessages from './../../../src/langs/zh-TW';
import enMessages from './../../../src/langs/en';
import mockStore from './../../helpers/mockStore';

import mainReducer, {setAppFont, SET_APP_FONT, setAppLocale, SET_APP_LOCALE, setWriteDelay,
  SET_WRITE_DELAY, setIntl, openExternal, OPEN_EXTERNAL, getAppVersion,
  GET_APP_VERSION_SUCCESS} from './../../../src/redux/modules/main';

const electron = window.require('electron');
const {ipcMain} = electron;

let store;

test.beforeEach((t) => {
  store = mockStore({});
});

test('main reducer should handle action GET_APP_VERSION_SUCCESS', (t) => {
  const appVersion = '0.0.1';
  const result = mainReducer(store.getState(), {type: GET_APP_VERSION_SUCCESS, result: {appVersion}});
  t.deepEqual(result.toJS(), {appVersion});
});

test('main reducer should handle action SET_APP_LOCALE', (t) => {
  const appLocale = 'en';
  const result = mainReducer(store.getState(), {type: SET_APP_LOCALE, appLocale});
  t.deepEqual(result.toJS(), {appLocale});
});

test('main reducer should handle action SET_WRITE_DELAY', (t) => {
  const writeDelay = 50;
  const result = mainReducer(store.getState(), {type: SET_WRITE_DELAY, writeDelay});
  t.deepEqual(result.toJS(), {writeDelay});
});

test('main reducer should handle action SET_APP_FONT', (t) => {
  const appFont = 'Tibetan Machine Uni';
  const result = mainReducer(store.getState(), {type: SET_APP_FONT, appFont});
  t.deepEqual(result.toJS(), {appFont});
});

test('should create an action to set app font', (t) => {

  const appFont = 'Tibetan Machine Uni';
  const expectedAction = {
    type: SET_APP_FONT,
    appFont
  };

  t.deepEqual(setAppFont(appFont), expectedAction);
});

test('should create an action to set app locale', (t) => {

  const appLocale = 'bo';
  const expectedAction = {
    type: SET_APP_LOCALE,
    appLocale
  };

  t.deepEqual(setAppLocale(appLocale), expectedAction);
});


test('should create an action to set write delay', (t) => {

  const writeDelay = 25;
  const expectedAction = {
    type: SET_WRITE_DELAY,
    writeDelay
  };

  t.deepEqual(setWriteDelay(writeDelay), expectedAction);
});

test('should get app version without any errors', async (t) => {

  const appVersion = '0.0.1';
  const expectedAction = {
    type: GET_APP_VERSION_SUCCESS
  };

  const eventName = 'get-app-version';

  ipcMain.once(eventName, (event, args) => {
    const id = args._id;
    delete args._id;
    args.appVersion = appVersion;
    event.sender.send(`${eventName}::${id}`, args);
  });

  const result = await store.dispatch(getAppVersion())
  t.is(result.appVersion, appVersion);
});

test('should create an action to set react intl', (t) => {

  const locale = 'zh-TW';
  const expectedAction = {
    type: '@@intl/UPDATE',
    payload: {
      locale,
      messages: zhTwMessages
    }
  };

  const resultAction = store.dispatch(setIntl(locale));

  t.deepEqual(resultAction, expectedAction);
});

test('should create an action to set react intl if no locale is provided', (t) => {

  const expectedAction = {
    type: '@@intl/UPDATE',
    payload: {
      locale: 'en',
      messages: enMessages
    }
  };

  const resultAction = store.dispatch(setIntl());

  t.deepEqual(resultAction, expectedAction);
});

test('should open external url without any errors', (t) => {
  const url = 'https://www.google.com';
  store.dispatch(openExternal(url));
  t.pass();
});
