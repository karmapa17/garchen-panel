import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';
import {updateIntl} from 'react-intl-redux';

import i18n from './../../helpers/i18n';

const SET_APP_LOCALE = 'garchen-panel/main/SET_APP_LOCALE';
const OPEN_EXTERNAL = 'garchen-panel/main/OPEN_EXTERNAL';
const OPEN_EXTERNAL_SUCCESS = 'garchen-panel/main/OPEN_EXTERNAL_SUCCESS';
const OPEN_EXTERNAL_FAIL = 'garchen-panel/main/OPEN_EXTERNAL_FAIL';

const SET_WRITE_DELAY = 'garchen-panel/main/SET_WRITE_DELAY';
const SET_APP_FONT = 'garchen-panel/main/SET_APP_FONT';

const initialState = Map({
  appLocale: 'en',
  appFont: 'Tibetan Machine Uni',
  writeDelay: 50
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

export function setIntl(locale = 'zh-TW') {
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
