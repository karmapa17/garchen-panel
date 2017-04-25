import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const SET_DRAWER_OPEN = 'garchen-panel/ui/SET_DRAWER_OPEN';
const TOGGLE_DRAWER_OPEN = 'garchen-panel/ui/TOGGLE_DRAWER_OPEN';
const SET_SNACK_BAR_PARAMS = 'garchen-panel/ui/SET_SNACK_BAR_PARAMS';

const initialState = Map({
  isDrawerOpen: false,
  snackBarMessage: '',
  isSnackBarOpen: false
});

export default createReducer(initialState, {

  [SET_DRAWER_OPEN]: (state, action) => {
    return state.set('isDrawerOpen', action.isDrawerOpen);
  },

  [TOGGLE_DRAWER_OPEN]: (state) => {
    return state.set('isDrawerOpen', (! state.get('isDrawerOpen')));
  },

  [SET_SNACK_BAR_PARAMS]: (state, action) => {
    return state.set('isSnackBarOpen', action.isSnackBarOpen)
      .set('snackBarMessage', action.snackBarMessage);
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
