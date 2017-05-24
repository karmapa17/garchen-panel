import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const SET_CACHE_PAGE_ENTRIES_DATA = 'garchen-panel/cache/SET_CACHE_PAGE_ENTRIES_DATA';
const DELETE_CACHE_PAGE_ENTRIES_DATA = 'garchen-panel/cache/DELETE_PAGE_ENTRIES_DATA';

const initialState = Map({
  cachePageEntriesDataSet: {}
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
  }
});

export function setPageEntriesData(folderId, data) {
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
