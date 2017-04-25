import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const SET_DRAWER_OPEN = 'garchen-panel/ui/SET_DRAWER_OPEN';
const TOGGLE_DRAWER_OPEN = 'garchen-panel/ui/TOGGLE_DRAWER_OPEN';
const SET_ADD_FOLDER_DIALOG_OPEN = 'garchen-panel/ui/SET_ADD_FOLDER_DIALOG_OPEN';
const SET_SNACK_BAR_PARAMS = 'garchen-panel/ui/SET_SNACK_BAR_PARAMS';
const UPDATE_TABLE_FOLDER_ENTRY_LIST_KEY = 'garchen-panel/ui/UPDATE_TABLE_FOLDER_ENTRY_LIST_KEY';

const initialState = Map({

  isDrawerOpen: false,

  snackBarMessage: '',
  isSnackBarOpen: false,

  isAddFolderDialogOpen: false,

  tableFolderEntryListKey: 0
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

  [SET_SNACK_BAR_PARAMS]: (state, action) => {
    return state.set('isSnackBarOpen', action.isSnackBarOpen)
      .set('snackBarMessage', action.snackBarMessage);
  },

  [UPDATE_TABLE_FOLDER_ENTRY_LIST_KEY]: (state) => {
    return state.set('tableFolderEntryListKey', state.get('tableFolderEntryListKey') + 1);
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

export function setSnackBarParams(isSnackBarOpen, snackBarMessage = '') {
  return {
    type: SET_SNACK_BAR_PARAMS,
    isSnackBarOpen,
    snackBarMessage
  };
}

export function setAddFolderDialogOpen(isAddFolderDialogOpen) {
  return {
    type: SET_ADD_FOLDER_DIALOG_OPEN,
    isAddFolderDialogOpen
  };
}

export function updateTableFolderEntryListKey() {
  return {
    type: UPDATE_TABLE_FOLDER_ENTRY_LIST_KEY
  };
}
