import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const DELETE_FOLDER_ENTRIES = 'garchen-panel/entry/DELETE_FOLDER_ENTRIES';
const DELETE_FOLDER_ENTRIES_SUCCESS = 'garchen-panel/entry/DELETE_FOLDER_ENTRIES_SUCCESS';
const DELETE_FOLDER_ENTRIES_FAIL = 'garchen-panel/entry/DELETE_FOLDER_ENTRIES_FAIL';

const LOAD_ENTRY = 'garchen-panel/entry/LOAD_ENTRY';
const LOAD_ENTRY_SUCCESS = 'garchen-panel/entry/LOAD_ENTRY_SUCCESS';
const LOAD_ENTRY_FAIL = 'garchen-panel/entry/LOAD_ENTRY_FAIL';

const initialState = Map({
  entry: null
});

export default createReducer(initialState, {
  [LOAD_ENTRY_SUCCESS]: (state, action) => {
    return state.set('entry', action.result);
  }
});

export function deleteFolderEntries(data) {
  return {
    types: [DELETE_FOLDER_ENTRIES, DELETE_FOLDER_ENTRIES_SUCCESS, DELETE_FOLDER_ENTRIES_FAIL],
    promise: (client) => client.send('DELETE /entries', data)
  };
}

export function loadEntry(data) {
  return {
    types: [LOAD_ENTRY, LOAD_ENTRY_SUCCESS, LOAD_ENTRY_FAIL],
    promise: (client) => client.send('GET /entry', data)
  };
}
