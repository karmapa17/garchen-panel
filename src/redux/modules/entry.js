import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const DELETE_FOLDER_ENTRIES = 'garchen-panel/entry/DELETE_FOLDER_ENTRIES';
const DELETE_FOLDER_ENTRIES_SUCCESS = 'garchen-panel/entry/DELETE_FOLDER_ENTRIES_SUCCESS';
const DELETE_FOLDER_ENTRIES_FAIL = 'garchen-panel/entry/DELETE_FOLDER_ENTRIES_FAIL';

const GET_ENTRY = 'garchen-panel/entry/GET_ENTRY';
const GET_ENTRY_SUCCESS = 'garchen-panel/entry/GET_ENTRY_SUCCESS';
const GET_ENTRY_FAIL = 'garchen-panel/entry/GET_ENTRY_FAIL';

const UPDATE_ENTRY = 'garchen-panel/entry/UPDATE_ENTRY';
const UPDATE_ENTRY_SUCCESS = 'garchen-panel/entry/UPDATE_ENTRY_SUCCESS';
const UPDATE_ENTRY_FAIL = 'garchen-panel/entry/UPDATE_ENTRY_FAIL';

const initialState = Map({
  entry: null
});

export default createReducer(initialState, {
  [GET_ENTRY_SUCCESS]: (state, action) => {
    return state.set('entry', action.result);
  }
});

export function deleteEntries(data) {
  return {
    types: [DELETE_FOLDER_ENTRIES, DELETE_FOLDER_ENTRIES_SUCCESS, DELETE_FOLDER_ENTRIES_FAIL],
    promise: (client) => client.send('delete-entries', data)
  };
}

export function getEntry(data) {
  return {
    types: [GET_ENTRY, GET_ENTRY_SUCCESS, GET_ENTRY_FAIL],
    promise: (client) => client.send('get-entry', data)
  };
}

export function updateEntry(data) {
  return {
    types: [UPDATE_ENTRY, UPDATE_ENTRY_SUCCESS, UPDATE_ENTRY_FAIL],
    promise: (client) => client.send('update-entry', data)
  };
}
