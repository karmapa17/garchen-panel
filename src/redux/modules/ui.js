import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const SET_DRAWER_OPEN = 'garchen-panel/ui/SET_DRAWER_OPEN';
const SET_SNACK_BAR_PARAMS = 'garchen-panel/ui/SET_SNACK_BAR_PARAMS';

const SET_PROCESSING_CSV_STATUS = 'garchen-panel/ui/SET_PROCESSING_CSV_STATUS';

const initialState = Map({
  isDrawerOpen: false,
  snackBarMessage: '',
  isSnackBarOpen: false,
  isProcessingCsv: true
});

export default createReducer(initialState, {

  [SET_DRAWER_OPEN]: (state, action) => {
    return state.set('isDrawerOpen', action.isDrawerOpen);
  },

  [SET_SNACK_BAR_PARAMS]: (state, action) => {
    return state.set('isSnackBarOpen', action.isSnackBarOpen)
      .set('snackBarMessage', action.snackBarMessage);
  },

  [SET_PROCESSING_CSV_STATUS]: (state, action) => {
    return state.set('isProcessingCsv', action.isProcessingCsv);
  }
});

export function setProcessingCsvStatus(isProcessingCsv) {
  return {
    type: SET_PROCESSING_CSV_STATUS,
    isProcessingCsv
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
