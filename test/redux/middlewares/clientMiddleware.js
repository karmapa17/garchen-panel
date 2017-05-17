import test from 'ava';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import clientMiddleware from './../../../src/redux/middlewares/clientMiddleware';
import ipc from './../../../src/helpers/ipc';

const mockStore = configureMockStore();

const TEST = 'garchen/test/TEST';
const TEST_SUCCESS = 'garchen/test/TEST_SUCCESS';
const TEST_FAIL = 'garchen/test/TEST_FAIL';

const dispatchWithStoreOf = (storeData, action) => {
  let dispatched = null
  const dispatch = clientMiddleware(ipc)(mockStore(storeData))(actionAttempt => dispatched = actionAttempt)
  dispatch(action)
  return dispatched
};

test('clientMiddleware should dispatch if store is empty', (t) => {

  const action = {
    types: [TEST, TEST_SUCCESS, TEST_FAIL],
    promise: () => {
      return Promise.resolve({message: 'success'});
    }
  };

  t.deepEqual(dispatchWithStoreOf({}, action), {type: TEST})
});

test('clientMiddleware should not dispatch if action is function', (t) => {
  const action = () => {};
  t.is(dispatchWithStoreOf({}, action), null);
});

test('clientMiddleware should dispatch directly if action does not have promise prop', (t) => {
  const action = {
    types: [TEST, TEST_SUCCESS, TEST_FAIL],
  };
  t.deepEqual(dispatchWithStoreOf({}, action), action);
});

test('clientMiddleware should dispatch with error', async (t) => {

  const action = {
    types: [TEST, TEST_SUCCESS, TEST_FAIL],
    promise: () => Promise.reject('dead')
  };

  const result = dispatchWithStoreOf({}, action);
  const rejectedMessage = 'intentionally reject';

  let times = 0;

  const next = (actionAttempt) => {

    if (rejectedMessage === actionAttempt.error) {
      t.pass();
    }

    ++times;

    if (2 === times) {
      return Promise.reject(rejectedMessage);
    }
  };

  const dispatch = clientMiddleware(ipc)(mockStore({}))(next);
  dispatch(action);
});
