import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const LOAD_FOLDERS = 'garchen-panel/folder/LOAD_FOLDERS';
const LOAD_FOLDERS_SUCCESS = 'garchen-panel/folder/LOAD_FOLDERS_SUCCESS';
const LOAD_FOLDERS_FAIL = 'garchen-panel/folder/LOAD_FOLDERS_FAIL';

const ADD_FOLDER = 'garchen-panel/folder/ADD_FOLDER';
const ADD_FOLDER_SUCCESS = 'garchen-panel/folder/ADD_FOLDER_SUCCESS';
const ADD_FOLDER_FAIL = 'garchen-panel/folder/ADD_FOLDER_FAIL';


const initialState = Map({
  folders: []
});

export default createReducer(initialState, {

  [LOAD_FOLDERS_SUCCESS]: (state, action) => {
    return state.set('folders', action.result);
  }
});

export function loadFolders() {
  return {
    types: [LOAD_FOLDERS, LOAD_FOLDERS_SUCCESS, LOAD_FOLDERS_FAIL],
    promise: (client) => client.send('GET /folders')
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
