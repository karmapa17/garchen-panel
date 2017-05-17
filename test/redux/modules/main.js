import test from 'ava';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import mainReducer, {setInterfaceFontSizeScalingFactor, SET_INTERFACE_FONT_SIZE_SCALING_FACTOR,
  setAppFont, SET_APP_FONT, setAppLocale, SET_APP_LOCALE, setWriteDelay,
  SET_WRITE_DELAY, setIntl} from './../../../src/redux/modules/main';

import zhTwMessages from './../../../src/langs/zh-TW';

const middlewares = [thunk];
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
