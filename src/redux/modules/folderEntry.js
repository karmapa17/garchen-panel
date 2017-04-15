import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const LOAD_FOLDER_ENTRIES = 'garchen-panel/folderEntry/LOAD_FOLDER_ENTRIES';
const LOAD_FOLDER_ENTRIES_SUCCESS = 'garchen-panel/folderEntry/LOAD_FOLDER_ENTRIES_SUCCESS';
const LOAD_FOLDER_ENTRIES_FAIL = 'garchen-panel/folderEntry/LOAD_FOLDER_ENTRIES_FAIL';

const ADD_FOLDER_ENTRY = 'garchen-panel/folderEntry/ADD_FOLDER_ENTRY';
const ADD_FOLDER_ENTRY_SUCCESS = 'garchen-panel/folderEntry/ADD_FOLDER_ENTRY_SUCCESS';
const ADD_FOLDER_ENTRY_FAIL = 'garchen-panel/folderEntry/ADD_FOLDER_ENTRY_FAIL';

const CHECK_FOLDER_ENTRY_EXISTS = 'garchen-panel/folderEntry/CHECK_FOLDER_ENTRY_EXISTS_ENTRY';
const CHECK_FOLDER_ENTRY_EXISTS_SUCCESS = 'garchen-panel/folderEntry/CHECK_FOLDER_ENTRY_EXISTS_ENTRY_SUCCESS';
const CHECK_FOLDER_ENTRY_EXISTS_FAIL = 'garchen-panel/folderEntry/CHECK_FOLDER_ENTRY_EXISTS_ENTRY_FAIL';

const ENTRY_PERPAGE = 3;

const initialState = Map({
  page: 1,
  perpage: ENTRY_PERPAGE,
  folderEntries: [],
  folderEntryCount: 0
});

export default createReducer(initialState, {

  [LOAD_FOLDER_ENTRIES_SUCCESS]: (state, action) => {
    return state.set('folderEntries', action.result.data)
      .set('folderEntryCount', action.result.total);
  }
});

export function loadFolderEntries(data) {
  return {
    types: [LOAD_FOLDER_ENTRIES, LOAD_FOLDER_ENTRIES_SUCCESS, LOAD_FOLDER_ENTRIES_FAIL],
    promise: (client) => client.send('GET /folder/entries', data)
  };
}

export function addFolderEntry(data) {
  return {
    types: [ADD_FOLDER_ENTRY, ADD_FOLDER_ENTRY_SUCCESS, ADD_FOLDER_ENTRY_FAIL],
    promise: (client) => client.send('POST /folder/entries', data)
  };
}

export function checkFolderEntryExists(data) {
  return {
    types: [CHECK_FOLDER_ENTRY_EXISTS, CHECK_FOLDER_ENTRY_EXISTS_SUCCESS, CHECK_FOLDER_ENTRY_EXISTS_FAIL],
    promise: (client) => client.send('GET /folder/entry/exists', data)
  };
}
