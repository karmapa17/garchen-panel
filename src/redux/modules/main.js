import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';
import {updateIntl} from 'react-intl-redux';

import i18n from './../../helpers/i18n';

const SET_DRAWER_OPEN = 'garchen-panel/main/SET_DRAWER_OPEN';
const TOGGLE_DRAWER_OPEN = 'garchen-panel/main/TOGGLE_DRAWER_OPEN';

const SET_ADD_FOLDER_DIALOG_OPEN = 'garchen-panel/main/SET_ADD_FOLDER_DIALOG_OPEN';

const initialState = Map({
  isDrawerOpen: false,
  isAddFolderDialogOpen: true
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

export function setIntl(locale = 'zh-TW') {
  return (dispatch) => {
    i18n.setLang(locale);
    return dispatch(updateIntl({
      locale,
      messages: i18n.getLangData(locale)
    }));
  };
}
