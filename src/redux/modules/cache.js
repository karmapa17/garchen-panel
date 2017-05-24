import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const SET_PAGE_ENTRIES_PARAMS = 'garchen-panel/cache/SET_PAGE_ENTRIES_PARAMS';

const initialState = Map({
  cachePageEntriesDataSet: {}
});

export default createReducer(initialState, {
  [SET_PAGE_ENTRIES_PARAMS]: (state, action) => {
    const cacheDataSet = state.get('cachePageEntriesDataSet');
    cacheDataSet[action.folderId] = action.data;
    return state.set('cachePageEntriesDataSet', cacheDataSet);
  }
});

export function setPageEntriesParams(folderId, data) {
  return {
    type: SET_PAGE_ENTRIES_PARAMS,
    folderId,
    data
  };
}
