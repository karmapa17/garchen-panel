import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const LIST_FOLDER_ENTRIES = 'garchen-panel/entry/LIST_FOLDER_ENTRIES';
const LIST_FOLDER_ENTRIES_SUCCESS = 'garchen-panel/entry/LIST_FOLDER_ENTRIES_SUCCESS';
const LIST_FOLDER_ENTRIES_FAIL = 'garchen-panel/entry/LIST_FOLDER_ENTRIES_FAIL';

const ADD_FOLDER_ENTRY = 'garchen-panel/entry/ADD_FOLDER_ENTRY';
const ADD_FOLDER_ENTRY_SUCCESS = 'garchen-panel/entry/ADD_FOLDER_ENTRY_SUCCESS';
const ADD_FOLDER_ENTRY_FAIL = 'garchen-panel/entry/ADD_FOLDER_ENTRY_FAIL';

const CHECK_FOLDER_ENTRY_EXISTS = 'garchen-panel/entry/CHECK_FOLDER_ENTRY_EXISTS_ENTRY';
const CHECK_FOLDER_ENTRY_EXISTS_SUCCESS = 'garchen-panel/entry/CHECK_FOLDER_ENTRY_EXISTS_ENTRY_SUCCESS';
const CHECK_FOLDER_ENTRY_EXISTS_FAIL = 'garchen-panel/entry/CHECK_FOLDER_ENTRY_EXISTS_ENTRY_FAIL';

const SET_SELECTED_FOLDER_ENTRY_IDS = 'garchen-panel/entry/SET_SELECTED_FOLDER_ENTRY_IDS';
const CLEAR_SELECTED_FOLDER_ENTRY_IDS = 'garchen-panel/entry/CLEAR_SELECTED_FOLDER_ENTRY_IDS';

const FOLDER_ENTRY_PERPAGE = 10;

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
  entry: null,
  nextEntryId: null,
  prevEntryId: null,
  perpage: FOLDER_ENTRY_PERPAGE,
  folderEntries: [],
  folderEntryCount: 0,
  selectedFolderEntryMap: []
});

export default createReducer(initialState, {

  [GET_ENTRY_SUCCESS]: (state, action) => {
    const {entry, nextEntryId, prevEntryId} = action.result;
    return state.set('entry', entry)
      .set('prevEntryId', prevEntryId)
      .set('nextEntryId', nextEntryId);
  },

  [UPDATE_ENTRY_SUCCESS]: (state, action) => {
    return state.set('entry', action.result);
  },

  [LIST_FOLDER_ENTRIES_SUCCESS]: (state, action) => {
    return state.set('folderEntries', action.result.data)
      .set('folderEntryCount', action.result.total);
  },

  [SET_SELECTED_FOLDER_ENTRY_IDS]: (state, action) => {
    const map = action.ids.reduce((obj, id) => {
      obj[id] = true;
      return obj;
    }, {});
    return state.set('selectedFolderEntryMap', map);
  },

  [CLEAR_SELECTED_FOLDER_ENTRY_IDS]: (state) => {
    return state.set('selectedFolderEntryMap', {});
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

export function setSelectedFolderEntryIds(ids) {
  return {
    type: SET_SELECTED_FOLDER_ENTRY_IDS,
    ids
  };
}

export function clearSelectedFolderEntryIds() {
  return {
    type: CLEAR_SELECTED_FOLDER_ENTRY_IDS
  };
}

export function listFolderEntries(data) {
  return {
    types: [LIST_FOLDER_ENTRIES, LIST_FOLDER_ENTRIES_SUCCESS, LIST_FOLDER_ENTRIES_FAIL],
    promise: (client) => client.send('list-folder-entries', data)
  };
}

export function addFolderEntry(data) {
  return {
    types: [ADD_FOLDER_ENTRY, ADD_FOLDER_ENTRY_SUCCESS, ADD_FOLDER_ENTRY_FAIL],
    promise: (client) => client.send('add-folder-entry', data)
  };
}

export function checkFolderEntryExists(data) {
  return {
    types: [CHECK_FOLDER_ENTRY_EXISTS, CHECK_FOLDER_ENTRY_EXISTS_SUCCESS, CHECK_FOLDER_ENTRY_EXISTS_FAIL],
    promise: (client) => client.send('check-folder-entry-exists', data)
  };
}
