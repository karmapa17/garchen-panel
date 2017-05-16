import test from 'ava';

import {setInterfaceFontSizeScalingFactor, SET_INTERFACE_FONT_SIZE_SCALING_FACTOR,
  setAppFont, SET_APP_FONT, setAppLocale, SET_APP_LOCALE, setWriteDelay, SET_WRITE_DELAY} from './../../../src/redux/modules/main';

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
