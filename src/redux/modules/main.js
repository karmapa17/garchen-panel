import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';
import {updateIntl} from 'react-intl-redux';

import i18n from './../../helpers/i18n';

const ADD = 'garchen-desktop/main/ADD';

const initialState = Map({
  counterValue: 0
});

export default createReducer(initialState, {

  [ADD]: (state) => {
    return state.set('counterValue', state.get('counterValue') + 1);
  }
});

export function add() {
  return {
    type: ADD
  };
}

export function setIntl(locale = 'zh-TW') {
  return (dispatch) => {
    i18n.setLang(locale);
    return dispatch(updateIntl({
      locale,
      messages: i18n.getLangData(locale)
    }));
  };
}
