import Immutable from 'immutable';
import {createReducer} from 'redux-immutablejs';

const LOAD_AUTH = 'garchen-panel/auth/LOAD_AUTH';
const LOAD_AUTH_SUCCESS = 'garchen-panel/auth/LOAD_AUTH_SUCCESS';
const LOAD_AUTH_FAIL = 'garchen-panel/auth/LOAD_AUTH_FAIL';

const LOGIN = 'garchen-panel/auth/LOGIN';
const LOGIN_SUCCESS = 'garchen-panel/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'garchen-panel/auth/LOGIN_FAIL';

const LOGOUT_SUCCESS = 'garchen-panel/auth/LOGOUT_SUCCESS';

const initialState = Immutable.Map({
  auth: null,
  isLoadingAuth: false
});

export default createReducer(initialState, {

  [LOAD_AUTH]: (state) => {
    return state.set('isLoadingAuth', true);
  },

  [LOAD_AUTH_SUCCESS]: (state, action) => {
    return state.set('auth', action.result)
    .set('isLoadingAuth', false);
  },

  [LOAD_AUTH_FAIL]: (state) => {
    return state.set('auth', null)
      .set('isLoadingAuth', false);
  },

  [LOGIN_SUCCESS]: (state, action) => {
    return state.set('auth', action.result);
  },

  [LOGOUT_SUCCESS]: (state) => {
    return state.set('auth', null);
  }
});

export function login() {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.send('login')
  };
}

export function logout() {
  return {
    type: LOGOUT_SUCCESS
  };
}

export function startLoadAuth() {
  return {
    type: LOAD_AUTH
  };
}

export function loadAuthSuccess(result) {
  return {
    type: LOAD_AUTH_SUCCESS,
    result
  };
}

export function loadAuthFail() {
  return {
    type: LOAD_AUTH_FAIL
  };
}

export function createUser() {
  return () => {
  };
}

export function loadAuth() {
  return () => {
  };
}
