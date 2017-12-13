import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';
import {updateIntl} from 'react-intl-redux';

import i18n from './../../utils/i18n';

export const SET_APP_LOCALE = 'garchen-panel/main/SET_APP_LOCALE';
export const OPEN_EXTERNAL = 'garchen-panel/main/OPEN_EXTERNAL';
export const OPEN_EXTERNAL_SUCCESS = 'garchen-panel/main/OPEN_EXTERNAL_SUCCESS';
export const OPEN_EXTERNAL_FAIL = 'garchen-panel/main/OPEN_EXTERNAL_FAIL';
export const SET_WRITE_DELAY = 'garchen-panel/main/SET_WRITE_DELAY';
export const SET_APP_FONT = 'garchen-panel/main/SET_APP_FONT';
export const SET_INTERFACE_FONT_SIZE_SCALING_FACTOR = 'garchen/main/SET_INTERFACE_FONT_SIZE_SCALING_FACTOR';
export const SET_CONTENT_FONT_SIZE_SCALING_FACTOR = 'garchen/main/SET_CONTENT_FONT_SIZE_SCALING_FACTOR';
export const GET_APP_VERSION = 'garchen-panel/main/GET_APP_VERSION';
export const GET_APP_VERSION_SUCCESS = 'garchen-panel/main/GET_APP_VERSION_SUCCESS';
export const GET_APP_VERSION_FAIL = 'garchen-panel/main/GET_APP_VERSION_FAIL';
export const ADD_ROUTE_HISTORY = 'garchen-panel/main/ADD_ROUTE_HISTORY';
export const CLEAR_ROUTE_HISTORY = 'garchen-panel/main/CLEAR_ROUTE_HISTORY';

const initialState = Map({
  appVersion: '',
  appLocale: 'en',
  appFont: 'Tibetan Machine Uni',
  writeDelay: 50,
  routeHistory: []
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

  [GET_APP_VERSION_SUCCESS]: (state, action) => {
    return state.set('appVersion', action.result.appVersion);
  }
});

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

export function getAppVersion() {
  return {
    types: [GET_APP_VERSION, GET_APP_VERSION_SUCCESS, GET_APP_VERSION_FAIL],
    promise: (client) => {
      return client.send('get-app-version');
    }
  };
}
