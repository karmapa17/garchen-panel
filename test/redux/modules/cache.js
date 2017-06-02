import test from 'ava';
import {Map} from 'immutable';
import cacheReducer, {SET_CACHE_PAGE_ENTRIES, setCachePageEntries, DELETE_CACHE_PAGE_ENTRIES,
  deleteCachePageEntries, CLEAR_CACHE_PAGE_ENTRIES, clearCachePageEntries,
  SET_CACHE_PAGE_CROSS_FOLDER_SEARCH, setCachePageCrossFolderSearch,
  SET_CACHE_PAGE_FOLDERS, setCachePageFolders} from './../../../src/redux/modules/cache';

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
  const state = new Map({
    cachePageEntriesDataSet: {}
  });
  const action = {
    type: SET_CACHE_PAGE_ENTRIES,
    folderId,
    data
  };
  const result = cacheReducer(state, action);
  t.deepEqual(result.toJS().cachePageEntriesDataSet, {[folderId]: data});
});

test('should create an action to delete cache page entries', (t) => {

  const folderId = 1;
  const expectedAction = {
    type: DELETE_CACHE_PAGE_ENTRIES,
    folderId
  };
  t.deepEqual(deleteCachePageEntries(folderId), expectedAction);
});

test('cache reducer should handle action DELETE_CACHE_PAGE_ENTRIES', (t) => {

  const folderId = 1;
  const action = {
    type: DELETE_CACHE_PAGE_ENTRIES,
    folderId
  };
  const state = new Map({
    cachePageEntriesDataSet: {[folderId]: {hasSomethingInside: true}}
  });
  const result = cacheReducer(state, action);
  t.deepEqual(result.toJS().cachePageEntriesDataSet, {});
});

test('should create an action to clear cache page entries', (t) => {

  const expectedAction = {
    type: CLEAR_CACHE_PAGE_ENTRIES
  };
  t.deepEqual(clearCachePageEntries(), expectedAction);
});

test('cache reducer should handle action CLEAR_CACHE_PAGE_ENTRIES', (t) => {

  const action = {
    type: CLEAR_CACHE_PAGE_ENTRIES
  };
  const state = new Map({
    cachePageEntriesDataSet: {1: {hasSomethingInside: true}}
  });
  const result = cacheReducer(state, action);
  t.deepEqual(result.toJS().cachePageEntriesDataSet, {});
});

test('should create an action to set cache page cross folder search', (t) => {

  const data = {hello: 'world'};
  const expectedAction = {
    type: SET_CACHE_PAGE_CROSS_FOLDER_SEARCH,
    data
  };
  t.deepEqual(setCachePageCrossFolderSearch(data), expectedAction);
});

test('cache reducer should handle action SET_CACHE_PAGE_CROSS_FOLDER_SEARCH', (t) => {

  const data = {hello: 'world'};
  const action = {
    type: SET_CACHE_PAGE_CROSS_FOLDER_SEARCH,
    data
  };
  const state = new Map({
    cachePageCrossFolderSearch: {}
  });
  const result = cacheReducer(state, action);
  t.deepEqual(result.toJS().cachePageCrossFolderSearch, data);
});

test('should create an action to set cache page folders', (t) => {

  const data = {hello: 'world'};
  const expectedAction = {
    type: SET_CACHE_PAGE_FOLDERS,
    data
  };
  t.deepEqual(setCachePageFolders(data), expectedAction);
});
