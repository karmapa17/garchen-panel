import test from 'ava';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import mainReducer, {setInterfaceFontSizeScalingFactor, SET_INTERFACE_FONT_SIZE_SCALING_FACTOR,
  setAppFont, SET_APP_FONT, setAppLocale, SET_APP_LOCALE, setWriteDelay,
  SET_WRITE_DELAY, setIntl, openExternal, OPEN_EXTERNAL,
  setContentFontSizeScalingFactor, SET_CONTENT_FONT_SIZE_SCALING_FACTOR} from './../../../src/redux/modules/main';

import zhTwMessages from './../../../src/langs/zh-TW';
import enMessages from './../../../src/langs/en';
import clientMiddleware from './../../../src/redux/middlewares/clientMiddleware';
import ipc from './../../../src/helpers/ipc';

const middlewares = [thunk, clientMiddleware(ipc)];
const mockStore = configureMockStore(middlewares);

test('should create an action to set interface font size scaling factor', (t) => {

  const interfaceFontSizeScalingFactor = 1;
  const expectedAction = {
    type: SET_INTERFACE_FONT_SIZE_SCALING_FACTOR,
    interfaceFontSizeScalingFactor
  };

  t.deepEqual(setInterfaceFontSizeScalingFactor(interfaceFontSizeScalingFactor), expectedAction);
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

test('should create an action to set content font size scaling factor', (t) => {

  const contentFontSizeScalingFactor = 1.5;
  const expectedAction = {
    type: SET_CONTENT_FONT_SIZE_SCALING_FACTOR,
    contentFontSizeScalingFactor
  };

  t.deepEqual(setContentFontSizeScalingFactor(contentFontSizeScalingFactor), expectedAction);
});

test('should create an action to set react intl', (t) => {

  const store = mockStore({});
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

  const store = mockStore({});
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
  const store = mockStore({});
  const url = 'https://www.google.com';
  store.dispatch(openExternal(url));
  t.pass();
});

test('main reducer should handle action SET_APP_LOCALE', (t) => {
  const appLocale = 'en';
  const store = mockStore({});
  const result = mainReducer(store.getState(), {type: SET_APP_LOCALE, appLocale});
  t.deepEqual(result.toJS(), {appLocale});
});

test('main reducer should handle action SET_WRITE_DELAY', (t) => {
  const writeDelay = 50;
  const store = mockStore({});
  const result = mainReducer(store.getState(), {type: SET_WRITE_DELAY, writeDelay});
  t.deepEqual(result.toJS(), {writeDelay});
});

test('main reducer should handle action SET_APP_FONT', (t) => {
  const appFont = 'Tibetan Machine Uni';
  const store = mockStore({});
  const result = mainReducer(store.getState(), {type: SET_APP_FONT, appFont});
  t.deepEqual(result.toJS(), {appFont});
});

test('main reducer should handle action SET_INTERFACE_FONT_SIZE_SCALING_FACTOR', (t) => {
  const interfaceFontSizeScalingFactor = 1.5;
  const store = mockStore({});
  const result = mainReducer(store.getState(), {type: SET_INTERFACE_FONT_SIZE_SCALING_FACTOR, interfaceFontSizeScalingFactor});
  t.deepEqual(result.toJS(), {interfaceFontSizeScalingFactor});
});

test('main reducer should handle action SET_CONTENT_FONT_SIZE_SCALING_FACTOR', (t) => {
  const contentFontSizeScalingFactor = 1.5;
  const store = mockStore({});
  const result = mainReducer(store.getState(), {type: SET_CONTENT_FONT_SIZE_SCALING_FACTOR, contentFontSizeScalingFactor});
  t.deepEqual(result.toJS(), {contentFontSizeScalingFactor});
});
