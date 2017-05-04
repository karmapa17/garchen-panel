import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';
import {updateIntl} from 'react-intl-redux';

import i18n from './../../helpers/i18n';
import Cache from './../../helpers/Cache';

const SET_APP_LOCALE = 'garchen-panel/main/SET_APP_LOCALE';
const OPEN_EXTERNAL = 'garchen-panel/main/OPEN_EXTERNAL';
const OPEN_EXTERNAL_SUCCESS = 'garchen-panel/main/OPEN_EXTERNAL_SUCCESS';
const OPEN_EXTERNAL_FAIL = 'garchen-panel/main/OPEN_EXTERNAL_FAIL';

const SET_WRITE_DELAY = 'garchen-panel/main/SET_WRITE_DELAY';

const initialState = Map({
  appLocale: i18n.getLocale(),
  writeDelay: Cache.get('garchen:writeDelay') || 50
});

export default createReducer(initialState, {

  [SET_APP_LOCALE]: (state, action) => {
    return state.set('appLocale', action.appLocale);
  },

  [SET_WRITE_DELAY]: (state, action) => {
    const {writeDelay} = action;
    Cache.set('garchen:writeDelay', writeDelay);
    return state.set('writeDelay', writeDelay);
  }
});

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
    i18n.setLocale(locale);
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
