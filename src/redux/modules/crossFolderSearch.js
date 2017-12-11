import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

export const CROSS_FOLDER_SEARCH = 'garchen-panel/crossFolderSearch/CROSS_FOLDER_SEARCH';
export const CROSS_FOLDER_SEARCH_SUCCESS = 'garchen-panel/crossFolderSearch/CROSS_FOLDER_SEARCH_SUCCESS';
export const CROSS_FOLDER_SEARCH_FAIL = 'garchen-panel/crossFolderSearch/CROSS_FOLDER_SEARCH_FAIL';

const initialState = Map({
  isSearching: false,
  searchKeyword: '',
  perpage: 10,
  folders: [],
  total: 0
});

export default createReducer(initialState, {

  [CROSS_FOLDER_SEARCH]: (state) => {
    return state.set('isSearching', true);
  },

  [CROSS_FOLDER_SEARCH_SUCCESS]: (state, action) => {
    const {folders, total} = action.result;
    return state.set('folders', folders)
      .set('total', total)
      .set('isSearching', false);
  }
});

export function search(data) {
  return {
    types: [CROSS_FOLDER_SEARCH, CROSS_FOLDER_SEARCH_SUCCESS, CROSS_FOLDER_SEARCH_FAIL],
    promise: (client) => {
      return client.send('cross-folder-search', data);
    }
  };
}
