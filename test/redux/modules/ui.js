import test from 'ava';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import uiReducer, {SET_DRAWER_OPEN, setDrawerOpen, SET_SNACK_BAR_PARAMS, setSnackBarParams} from './../../../src/redux/modules/ui';

import clientMiddleware from './../../../src/redux/middlewares/clientMiddleware';
import ipc from './../../../src/helpers/ipc';

const middlewares = [thunk, clientMiddleware(ipc)];
const mockStore = configureMockStore(middlewares);

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

test('ui reducer should handle action SET_DRAWER_OPEN', (t) => {
  const isDrawerOpen = true;
  const store = mockStore({});
  const result = uiReducer(store.getState(), {type: SET_DRAWER_OPEN, isDrawerOpen});
  t.deepEqual(result.toJS(), {isDrawerOpen});
});
