import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const LOAD_ENTRIES = 'garchen-panel/entry/LOAD_ENTRIES';
const LOAD_ENTRIES_SUCCESS = 'garchen-panel/entry/LOAD_ENTRIES_SUCCESS';
const LOAD_ENTRIES_FAIL = 'garchen-panel/entry/LOAD_ENTRIES_FAIL';

const ENTRIE_PERPAGE = 20;

const initialState = Map({
  folderEntries: [],
  folderEntryCount: 0
});

export default createReducer(initialState, {

  [LOAD_ENTRIES_SUCCESS]: (state, action) => {
    return state.set('folderEntries', action.result.data)
      .set('folderEntryCount', action.result.total);
  }
});

export function loadFolderEntries(data) {
  return {
    types: [LOAD_ENTRIES, LOAD_ENTRIES_SUCCESS, LOAD_ENTRIES_FAIL],
    promise: (client) => client.send('GET /folder/entries', data)
  };
}
