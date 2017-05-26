import test from 'ava';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import uiReducer, {SET_DRAWER_OPEN, setDrawerOpen} from './../../../src/redux/modules/ui';

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
