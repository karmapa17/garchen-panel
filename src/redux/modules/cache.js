import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

export const SET_CACHE_PAGE_ENTRIES = 'garchen-panel/cache/SET_CACHE_PAGE_ENTRIES';
export const DELETE_CACHE_PAGE_ENTRIES = 'garchen-panel/cache/DELETE_CACHE_PAGE_ENTRIES';
export const SET_CACHE_PAGE_CROSS_FOLDER_SEARCH = 'garchen-panel/cache/SET_CACHE_PAGE_CROSS_FOLDER_SEARCH';
export const CLEAR_CACHE_PAGE_ENTRIES = 'garchn-panel/cache/CLEAR_CACHE_PAGE_ENTRIES';
export const SET_CACHE_PAGE_FOLDERS = 'garchen-panel/cache/SET_CACHE_PAGE_FOLDERS';
export const CLEAR_CACHE_PAGE_FOLDERS = 'garchen-panel/cache/CLEAR_CACHE_PAGE_FOLDERS';

const initialState = Map({
  cachePageEntriesDataSet: {},
  cachePageCrossFolderSearch: {},
  cachePageFolders: {}
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
  },

  [SET_CACHE_PAGE_FOLDERS]: (state, action) => {
    return state.set('cachePageFolders', action.data);
  },

  [CLEAR_CACHE_PAGE_FOLDERS]: (state) => {
    return state.set('cachePageFolders', {});
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

export function setCachePageFolders(data) {
  return {
    type: SET_CACHE_PAGE_FOLDERS,
    data
  };
}

export function clearCachePageFolders() {
  return {
    type: CLEAR_CACHE_PAGE_FOLDERS
  };
}
