import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const DELETE_FOLDER_ENTRIES = 'garchen-panel/entry/DELETE_FOLDER_ENTRIES';
const DELETE_FOLDER_ENTRIES_SUCCESS = 'garchen-panel/entry/DELETE_FOLDER_ENTRIES_SUCCESS';
const DELETE_FOLDER_ENTRIES_FAIL = 'garchen-panel/entry/DELETE_FOLDER_ENTRIES_FAIL';

const initialState = Map({
});

export default createReducer(initialState, {
});

export function deleteFolderEntries(data) {
  return {
    types: [DELETE_FOLDER_ENTRIES, DELETE_FOLDER_ENTRIES_SUCCESS, DELETE_FOLDER_ENTRIES_FAIL],
    promise: (client) => client.send('DELETE /entries', data)
  };
}
