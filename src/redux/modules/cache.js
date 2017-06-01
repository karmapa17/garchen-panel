import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const SET_CACHE_PAGE_ENTRIES = 'garchen-panel/cache/SET_CACHE_PAGE_ENTRIES';
const DELETE_CACHE_PAGE_ENTRIES = 'garchen-panel/cache/DELETE_CACHE_PAGE_ENTRIES';
const SET_CACHE_PAGE_CROSS_FOLDER_SEARCH = 'garchen-panel/cache/SET_CACHE_PAGE_CROSS_FOLDER_SEARCH';
const CLEAR_CACHE_PAGE_ENTRIES = 'garchn-panel/cache/CLEAR_CACHE_PAGE_ENTRIES';

const initialState = Map({
  cachePageEntriesDataSet: {},
  cachePageCrossFolderSearch: {}
});

export default createReducer(initialState, {

  [SET_CACHE_PAGE_ENTRIES]: (state, action) => {
    const cacheDataSet = state.get('cachePageEntriesDataSet');
    cacheDataSet[action.folderId] = action.data;
    return state.set('cachePageEntriesDataSet', cacheDataSet);
  },

  [DELETE_CACHE_PAGE_ENTRIES]: (state, action) => {
    const cacheDataSet = state.get('cachePageEntriesDataSet');
    delete cacheDataSet[action.folderId];
    return state.set('cachePageEntriesDataSet', cacheDataSet);
  },

  [CLEAR_CACHE_PAGE_ENTRIES]: (state) => {
    return state.set('cachePageEntriesDataSet', {});
  },

  [SET_CACHE_PAGE_CROSS_FOLDER_SEARCH]: (state, action) => {
    return state.set('cachePageCrossFolderSearch', action.data);
  }
});

export function setCachePageEntries(folderId, data) {
  return {
    type: SET_CACHE_PAGE_ENTRIES,
    folderId,
    data
  };
}

export function deleteCachePageEntries(folderId) {
  return {
    type: DELETE_CACHE_PAGE_ENTRIES,
    folderId
  };
}

export function clearCachePageEntries() {
  return {
    type: CLEAR_CACHE_PAGE_ENTRIES
  };
}

export function setCachePageCrossFolderSearch(data) {
  return {
    type: SET_CACHE_PAGE_CROSS_FOLDER_SEARCH,
    data
  };
}
