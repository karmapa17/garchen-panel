import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';
import {updateIntl} from 'react-intl-redux';
import {i18n} from './../../helpers';

const LOAD_FOLDERS = 'garchen-panel/folder/LOAD_FOLDERS';
const LOAD_FOLDERS_SUCCESS = 'garchen-panel/folder/LOAD_FOLDERS_SUCCESS';
const LOAD_FOLDERS_FAIL = 'garchen-panel/folder/LOAD_FOLDERS_FAIL';

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
