import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const LOAD_FOLDERS = 'garchen-panel/folder/LOAD_FOLDERS';
const LOAD_FOLDERS_SUCCESS = 'garchen-panel/folder/LOAD_FOLDERS_SUCCESS';
const LOAD_FOLDERS_FAIL = 'garchen-panel/folder/LOAD_FOLDERS_FAIL';

const ADD_FOLDER = 'garchen-panel/folder/ADD_FOLDER';
const ADD_FOLDER_SUCCESS = 'garchen-panel/folder/ADD_FOLDER_SUCCESS';
const ADD_FOLDER_FAIL = 'garchen-panel/folder/ADD_FOLDER_FAIL';

const SET_PAGE_PARAMS = 'garchen-panel/folder/SET_PAGE_PARAMS';

const LOAD_FOLDER = 'garchen-panel/folder/LOAD_FOLDER';
const LOAD_FOLDER_SUCCESS = 'garchen-panel/folder/LOAD_FOLDER_SUCCESS';
const LOAD_FOLDER_FAIL = 'garchen-panel/folder/LOAD_FOLDER_FAIL';

const UPDATE_FOLDER = 'garchen-panel/folder/UPDATE_FOLDER';
const UPDATE_FOLDER_SUCCESS = 'garchen-panel/folder/UPDATE_FOLDER_SUCCESS';
const UPDATE_FOLDER_FAIL = 'garchen-panel/folder/UPDATE_FOLDER_FAIL';

const FOLDER_PERPAGE = 20;

const initialState = Map({
  page: 1,
  perpage: FOLDER_PERPAGE,
  folder: null,
  folders: [],
  folderCount: 0
});

export default createReducer(initialState, {

  [LOAD_FOLDER_SUCCESS]: (state, action) => {
    return state.set('folder', action.result);
  },

  [LOAD_FOLDERS_SUCCESS]: (state, action) => {
    return state.set('folders', action.result.data)
      .set('folderCount', action.result.total);
  },

  [SET_PAGE_PARAMS]: (state, action) => {
    return state.set('page', action.page)
      .set('perpage', action.perpage);
  }
});

export function loadFolder(data) {
  return {
    types: [LOAD_FOLDER, LOAD_FOLDER_SUCCESS, LOAD_FOLDER_FAIL],
    promise: (client) => client.send('GET /folder', data)
  };
}

export function loadFolders(data) {
  return {
    types: [LOAD_FOLDERS, LOAD_FOLDERS_SUCCESS, LOAD_FOLDERS_FAIL],
    promise: (client) => client.send('GET /folders', data)
  };
}

export function addFolder(data) {
  return {
    types: [ADD_FOLDER, ADD_FOLDER_SUCCESS, ADD_FOLDER_FAIL],
    promise: (client) => {
      return client.send('POST /folders', data);
    }
  };
}

export function updateFolder(data) {
  return {
    types: [UPDATE_FOLDER, UPDATE_FOLDER_SUCCESS, UPDATE_FOLDER_FAIL],
    promise: (client) => {
      return client.send('PUT /folder', data);
    }
  };
}

export function setPageParams(page, perpage = FOLDER_PERPAGE) {
  return {
    type: SET_PAGE_PARAMS,
    page,
    perpage
  };
}
