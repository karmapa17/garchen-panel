import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';
import {updateIntl} from 'react-intl-redux';

import i18n from './../../helpers/i18n';

export const SET_APP_LOCALE = 'garchen-panel/main/SET_APP_LOCALE';
export const OPEN_EXTERNAL = 'garchen-panel/main/OPEN_EXTERNAL';
export const OPEN_EXTERNAL_SUCCESS = 'garchen-panel/main/OPEN_EXTERNAL_SUCCESS';
export const OPEN_EXTERNAL_FAIL = 'garchen-panel/main/OPEN_EXTERNAL_FAIL';
export const SET_WRITE_DELAY = 'garchen-panel/main/SET_WRITE_DELAY';
export const SET_APP_FONT = 'garchen-panel/main/SET_APP_FONT';
export const SET_INTERFACE_FONT_SIZE_SCALING_FACTOR = 'garchen/main/SET_INTERFACE_FONT_SIZE_SCALING_FACTOR';
export const SET_CONTENT_FONT_SIZE_SCALING_FACTOR = 'garchen/main/SET_CONTENT_FONT_SIZE_SCALING_FACTOR';

const initialState = Map({
  appLocale: 'en',
  appFont: 'Tibetan Machine Uni',
  writeDelay: 50,
  interfaceFontSizeScalingFactor: 1,
  contentFontSizeScalingFactor: 1
});

export default createReducer(initialState, {

  [SET_APP_LOCALE]: (state, action) => {
    return state.set('appLocale', action.appLocale);
  },

  [SET_WRITE_DELAY]: (state, action) => {
    return state.set('writeDelay', action.writeDelay);
  },

  [SET_APP_FONT]: (state, action) => {
    return state.set('appFont', action.appFont);
  },

  [SET_INTERFACE_FONT_SIZE_SCALING_FACTOR]: (state, action) => {
    return state.set('interfaceFontSizeScalingFactor', action.interfaceFontSizeScalingFactor);
  },

  [SET_CONTENT_FONT_SIZE_SCALING_FACTOR]: (state, action) => {
    return state.set('contentFontSizeScalingFactor', action.contentFontSizeScalingFactor);
  },
});

export function setContentFontSizeScalingFactor(contentFontSizeScalingFactor) {
  return {
    type: SET_CONTENT_FONT_SIZE_SCALING_FACTOR,
    contentFontSizeScalingFactor
  };
}

export function setInterfaceFontSizeScalingFactor(interfaceFontSizeScalingFactor) {
  return {
    type: SET_INTERFACE_FONT_SIZE_SCALING_FACTOR,
    interfaceFontSizeScalingFactor
  };
}

export function setAppFont(appFont) {
  return {
    type: SET_APP_FONT,
    appFont
  };
}

export function setAppLocale(appLocale) {
  return {
    type: SET_APP_LOCALE,
    appLocale
  };
}

export function setWriteDelay(writeDelay) {
  return {
    type: SET_WRITE_DELAY,
    writeDelay
  };
}

export function setIntl(locale = 'en') {
  return (dispatch) => {
    dispatch(setAppLocale(locale));
    return dispatch(updateIntl({
      locale,
      messages: i18n.getLocaleData(locale)
    }));
  };
}

export function openExternal(url) {
  return {
    types: [OPEN_EXTERNAL, OPEN_EXTERNAL_SUCCESS, OPEN_EXTERNAL_FAIL],
    promise: (client) => {
      return client.send('open-external', {url});
    }
  };
}
