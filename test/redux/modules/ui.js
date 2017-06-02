import test from 'ava';
import uiReducer, {SET_DRAWER_OPEN, setDrawerOpen, SET_SNACK_BAR_PARAMS, setSnackBarParams} from './../../../src/redux/modules/ui';
import mockStore from './../../helpers/mockStore';

let store;

test.beforeEach((t) => {
  store = mockStore({});
});

test('should create an action to set drawer open', (t) => {

  const isDrawerOpen = true;
  const expectedAction = {
    type: SET_DRAWER_OPEN,
    isDrawerOpen
  };

  t.deepEqual(setDrawerOpen(isDrawerOpen), expectedAction);
});

test('should create an action to set snack bar params', (t) => {

  const isSnackBarOpen = true;
  const snackBarMessage = 'hello world';
  const expectedAction = {
    type: SET_SNACK_BAR_PARAMS,
    isSnackBarOpen,
    snackBarMessage
  };

  t.deepEqual(setSnackBarParams(isSnackBarOpen, snackBarMessage), expectedAction);
});

test('should create an action to set snack bar params ( empty snack bar message )', (t) => {

  const isSnackBarOpen = true;
  const expectedAction = {
    type: SET_SNACK_BAR_PARAMS,
    isSnackBarOpen,
    snackBarMessage: ''
  };

  t.deepEqual(setSnackBarParams(isSnackBarOpen), expectedAction);
});

test('ui reducer should handle action SET_DRAWER_OPEN', (t) => {
  const isDrawerOpen = true;
  const result = uiReducer(store.getState(), {type: SET_DRAWER_OPEN, isDrawerOpen});
  t.deepEqual(result.toJS(), {isDrawerOpen});
});

test('ui reducer should handle action SET_SNACK_BAR_PARAMS', (t) => {
  const isSnackBarOpen = true;
  const snackBarMessage = 'hello world';
  const result = uiReducer(store.getState(), {type: SET_SNACK_BAR_PARAMS, isSnackBarOpen, snackBarMessage});
  t.deepEqual(result.toJS(), {isSnackBarOpen, snackBarMessage});
});
