import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const SET_CACHE_PAGE_ENTRIES_DATA = 'garchen-panel/cache/SET_CACHE_PAGE_ENTRIES_DATA';
const DELETE_CACHE_PAGE_ENTRIES_DATA = 'garchen-panel/cache/DELETE_PAGE_ENTRIES_DATA';

const SET_CACHE_PAGE_CROSS_FOLDER_SEARCH = 'garchen-panel/cache/SET_CACHE_PAGE_CROSS_FOLDER_SEARCH';

const initialState = Map({
  cachePageEntriesDataSet: {},
  cachePageCrossFolderSearch: {}
});

export default createReducer(initialState, {

  [SET_CACHE_PAGE_ENTRIES_DATA]: (state, action) => {
    const cacheDataSet = state.get('cachePageEntriesDataSet');
    cacheDataSet[action.folderId] = action.data;
    return state.set('cachePageEntriesDataSet', cacheDataSet);
  },

  [DELETE_CACHE_PAGE_ENTRIES_DATA]: (state, action) => {
    const cacheDataSet = state.get('cachePageEntriesDataSet');
    delete cacheDataSet[action.folderId];
    return state.set('cachePageEntriesDataSet', cacheDataSet);
  },

  [SET_CACHE_PAGE_CROSS_FOLDER_SEARCH]: (state, action) => {
    return state.set('cachePageCrossFolderSearch', action.data);
  },
});

export function setCachePageEntriesData(folderId, data) {
  return {
    type: SET_CACHE_PAGE_ENTRIES_DATA,
    folderId,
    data
  };
}

export function deleteCachePageEntriesData(folderId) {
  return {
    type: DELETE_CACHE_PAGE_ENTRIES_DATA,
    folderId
  };
}

export function setCachePageCrossFolderSearch(data) {
  return {
    type: SET_CACHE_PAGE_CROSS_FOLDER_SEARCH,
    data
  };
}
