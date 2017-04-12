import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';
import {updateIntl} from 'react-intl-redux';

import i18n from './../../helpers/i18n';

const SET_DRAWER_OPEN = 'garchen-panel/main/SET_DRAWER_OPEN';
const TOGGLE_DRAWER_OPEN = 'garchen-panel/main/TOGGLE_DRAWER_OPEN';
const SET_ADD_FOLDER_DIALOG_OPEN = 'garchen-panel/main/SET_ADD_FOLDER_DIALOG_OPEN';
const SET_APP_LOCALE = 'garchen-panel/main/SET_APP_LOCALE';

const SET_TARGET_LANGUAGES = 'garchen-panel/main/SET_TARGET_LANGUAGES';

const initialState = Map({
  appLocale: i18n.getLocale(),
  isDrawerOpen: false,
  isAddFolderDialogOpen: false,
  targetLanguages: []
});

export default createReducer(initialState, {

  [SET_DRAWER_OPEN]: (state, action) => {
    return state.set('isDrawerOpen', action.isDrawerOpen);
  },

  [TOGGLE_DRAWER_OPEN]: (state) => {
    return state.set('isDrawerOpen', (! state.get('isDrawerOpen')));
  },

  [SET_ADD_FOLDER_DIALOG_OPEN]: (state, action) => {
    return state.set('isAddFolderDialogOpen', action.isAddFolderDialogOpen);
  },

  [SET_APP_LOCALE]: (state, action) => {
    return state.set('appLocale', action.appLocale);
  },

  [SET_TARGET_LANGUAGES]: (state, action) => {
    return state.set('targetLanguages', action.targetLanguages);
  }
});

export function toggleDrawerOpen() {
  return {
    type: TOGGLE_DRAWER_OPEN
  };
}

export function setDrawerOpen(isDrawerOpen) {
  return {
    type: SET_DRAWER_OPEN,
    isDrawerOpen
  };
}

export function setAddFolderDialogOpen(isAddFolderDialogOpen) {
  return {
    type: SET_ADD_FOLDER_DIALOG_OPEN,
    isAddFolderDialogOpen
  };
}

export function setAppLocale(appLocale) {
  return {
    type: SET_APP_LOCALE,
    appLocale
  };
}

export function setTargetLanguages(targetLanguages) {
  return {
    type: SET_TARGET_LANGUAGES,
    targetLanguages
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
