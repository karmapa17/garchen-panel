import test from 'ava';
import {Map} from 'immutable';
import cacheReducer, {SET_CACHE_PAGE_ENTRIES, setCachePageEntries, DELETE_CACHE_PAGE_ENTRIES,
  deleteCachePageEntries} from './../../../src/redux/modules/cache';
import mockStore from './../../helpers/mockStore';

let store;

test.before((t) => {
  store = mockStore(Map({
    cachePageEntriesDataSet: {},
    cachePageCrossFolderSearch: {},
    cachePageFolders: {}
  }));
});

test('should create an action to set cache page entries', (t) => {

  const folderId = 1;
  const data = {hello: 'world'};
  const expectedAction = {
    type: SET_CACHE_PAGE_ENTRIES,
    folderId,
    data
  };

  t.deepEqual(setCachePageEntries(folderId, data), expectedAction);
});

test('cache reducer should handle action SET_CACHE_PAGE_ENTRIES', (t) => {
  const folderId = 1;
  const data = {hello: 'world'};
  const result = cacheReducer(store.getState(), {type: SET_CACHE_PAGE_ENTRIES, folderId, data});
  t.deepEqual(result.toJS().cachePageEntriesDataSet, {[folderId]: data});
});
