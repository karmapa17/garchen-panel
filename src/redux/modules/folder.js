import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const LIST_FOLDERS = 'garchen-panel/folder/LIST_FOLDERS';
const LIST_FOLDERS_SUCCESS = 'garchen-panel/folder/LIST_FOLDERS_SUCCESS';
const LIST_FOLDERS_FAIL = 'garchen-panel/folder/LIST_FOLDERS_FAIL';

const ADD_FOLDER = 'garchen-panel/folder/ADD_FOLDER';
const ADD_FOLDER_SUCCESS = 'garchen-panel/folder/ADD_FOLDER_SUCCESS';
const ADD_FOLDER_FAIL = 'garchen-panel/folder/ADD_FOLDER_FAIL';

const SET_PAGE_PARAMS = 'garchen-panel/folder/SET_PAGE_PARAMS';

const GET_FOLDER = 'garchen-panel/folder/GET_FOLDER';
const GET_FOLDER_SUCCESS = 'garchen-panel/folder/GET_FOLDER_SUCCESS';
const GET_FOLDER_FAIL = 'garchen-panel/folder/GET_FOLDER_FAIL';

const UPDATE_FOLDER = 'garchen-panel/folder/UPDATE_FOLDER';
const UPDATE_FOLDER_SUCCESS = 'garchen-panel/folder/UPDATE_FOLDER_SUCCESS';
const UPDATE_FOLDER_FAIL = 'garchen-panel/folder/UPDATE_FOLDER_FAIL';

const CHECK_FOLDER_EXISTS = 'garchen-panel/folder/CHECK_FOLDER_EXISTS';
const CHECK_FOLDER_EXISTS_SUCCESS = 'garchen-panel/folder/CHECK_FOLDER_EXISTS_SUCCESS';
const CHECK_FOLDER_EXISTS_FAIL = 'garchen-panel/folder/CHECK_FOLDER_EXISTS_FAIL';

const DELETE_FOLDER = 'garchen-panel/folder/DELETE_FOLDER';
const DELETE_FOLDER_SUCCESS = 'garchen-panel/folder/DELETE_FOLDER_SUCCESS';
const DELETE_FOLDER_FAIL = 'garchen-panel/folder/DELETE_FOLDER_FAIL';

const FOLDER_PERPAGE = 20;

const initialState = Map({
  page: 1,
  perpage: FOLDER_PERPAGE,
  folder: null,
  folders: [],
  folderCount: 0
});

export default createReducer(initialState, {

  [GET_FOLDER_SUCCESS]: (state, action) => {
    return state.set('folder', action.result);
  },

  [LIST_FOLDERS_SUCCESS]: (state, action) => {
    return state.set('folders', action.result.data)
      .set('folderCount', action.result.total);
  },

  [SET_PAGE_PARAMS]: (state, action) => {
    return state.set('page', action.page)
      .set('perpage', action.perpage);
  }
});

export function getFolder(data) {
  return {
    types: [GET_FOLDER, GET_FOLDER_SUCCESS, GET_FOLDER_FAIL],
    promise: (client) => client.send('get-folder', data)
  };
}

export function listFolders(data) {
  return {
    types: [LIST_FOLDERS, LIST_FOLDERS_SUCCESS, LIST_FOLDERS_FAIL],
    promise: (client) => client.send('list-folders', data)
  };
}

export function addFolder(data) {
  return {
    types: [ADD_FOLDER, ADD_FOLDER_SUCCESS, ADD_FOLDER_FAIL],
    promise: (client) => {
      return client.send('add-folder', data);
    }
  };
}

export function updateFolder(data) {
  return {
    types: [UPDATE_FOLDER, UPDATE_FOLDER_SUCCESS, UPDATE_FOLDER_FAIL],
    promise: (client) => {
      return client.send('update-folder', data);
    }
  };
}

export function deleteFolder(data) {
  return {
    types: [DELETE_FOLDER, DELETE_FOLDER_SUCCESS, DELETE_FOLDER_FAIL],
    promise: (client) => {
      return client.send('delete-folder', data);
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

export function checkFolderExists(data) {
  return {
    types: [CHECK_FOLDER_EXISTS, CHECK_FOLDER_EXISTS_SUCCESS, CHECK_FOLDER_EXISTS_FAIL],
    promise: (client) => {
      return client.send('check-folder-exists', data);
    }
  };
}
