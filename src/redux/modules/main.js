import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';
import {updateIntl} from 'react-intl-redux';

import i18n from './../../helpers/i18n';

const SET_APP_LOCALE = 'garchen-panel/main/SET_APP_LOCALE';


const initialState = Map({
  appLocale: i18n.getLocale()
});

export default createReducer(initialState, {

  [SET_APP_LOCALE]: (state, action) => {
    return state.set('appLocale', action.appLocale);
  }
});

export function setAppLocale(appLocale) {
  return {
    type: SET_APP_LOCALE,
    appLocale
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
