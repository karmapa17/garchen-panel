import {Map} from 'immutable';
import {createReducer} from 'redux-immutablejs';

const LIST_FOLDERS = 'garchen-panel/folder/LIST_FOLDERS';
const LIST_FOLDERS_SUCCESS = 'garchen-panel/folder/LIST_FOLDERS_SUCCESS';
const LIST_FOLDERS_FAIL = 'garchen-panel/folder/LIST_FOLDERS_FAIL';

const LIST_DELETED_FOLDERS = 'garchen-panel/folder/LIST_DELETED_FOLDERS';
const LIST_DELETED_FOLDERS_SUCCESS = 'garchen-panel/folder/LIST_DELETED_FOLDERS_SUCCESS';
const LIST_DELETED_FOLDERS_FAIL = 'garchen-panel/folder/LIST_DELETED_FOLDERS_FAIL';

const ADD_FOLDER = 'garchen-panel/folder/ADD_FOLDER';
const ADD_FOLDER_SUCCESS = 'garchen-panel/folder/ADD_FOLDER_SUCCESS';
const ADD_FOLDER_FAIL = 'garchen-panel/folder/ADD_FOLDER_FAIL';

const GET_FOLDER = 'garchen-panel/folder/GET_FOLDER';
const GET_FOLDER_SUCCESS = 'garchen-panel/folder/GET_FOLDER_SUCCESS';
const GET_FOLDER_FAIL = 'garchen-panel/folder/GET_FOLDER_FAIL';

const UPDATE_FOLDER = 'garchen-panel/folder/UPDATE_FOLDER';
const UPDATE_FOLDER_SUCCESS = 'garchen-panel/folder/UPDATE_FOLDER_SUCCESS';
const UPDATE_FOLDER_FAIL = 'garchen-panel/folder/UPDATE_FOLDER_FAIL';

const CHECK_FOLDER_EXISTS = 'garchen-panel/folder/CHECK_FOLDER_EXISTS';
const CHECK_FOLDER_EXISTS_SUCCESS = 'garchen-panel/folder/CHECK_FOLDER_EXISTS_SUCCESS';
const CHECK_FOLDER_EXISTS_FAIL = 'garchen-panel/folder/CHECK_FOLDER_EXISTS_FAIL';

const DELETE_FOLDERS = 'garchen-panel/folder/DELETE_FOLDERS';
const DELETE_FOLDERS_SUCCESS = 'garchen-panel/folder/DELETE_FOLDERS_SUCCESS';
const DELETE_FOLDERS_FAIL = 'garchen-panel/folder/DELETE_FOLDERS_FAIL';

const ADD_FOLDER_BY_CSV = 'garchen-panel/folder/ADD_FOLDER_BY_CSV';
const ADD_FOLDER_BY_CSV_SUCCESS = 'garchen-panel/folder/ADD_FOLDER_BY_CSV_SUCCESS';
const ADD_FOLDER_BY_CSV_FAIL = 'garchen-panel/folder/ADD_FOLDER_BY_CSV_FAIL';

const CANCEL_IMPORTING_CSV = 'garchen-panel/folder/CANCEL_IMPORTING_CSV';
const CANCEL_IMPORTING_CSV_SUCCESS = 'garchen-panel/folder/CANCEL_IMPORTING_CSV_SUCCESS';
const CANCEL_IMPORTING_CSV_FAIL = 'garchen-panel/folder/CANCEL_IMPORTING_CSV_FAIL';

const SET_IMPORTING_FOLDER_ID = 'garchen-panel/folder/SET_IMPORTING_FOLDER_ID';

const SET_DISPLAY_FOLDER_PERPAGE = 'garchen-panel/folder/SET_DISPLAY_FOLDER_PERPAGE';

const EXPORT_FOLDER_TO_CSV = 'garchen-panel/folder/EXPORT_FOLDER_TO_CSV';
const EXPORT_FOLDER_TO_CSV_SUCCESS = 'garchen-panel/folder/EXPORT_FOLDER_TO_CSV_SUCCESS';
const EXPORT_FOLDER_TO_CSV_FAIL = 'garchen-panel/folder/EXPORT_FOLDER_TO_CSV_FAIL';

const SET_IS_PROCESSING_CSV = 'garchen-panel/folder/SET_IS_PROCESSING_CSV';
const SET_IS_OPENING_DIALOG = 'garchen-panel/folder/SET_IS_OPENING_DIALOG';

const MARK_DELETED_AT_TO_FOLDERS = 'garchen-panel/folder/MARK_DELETED_AT_TO_FOLDERS';
const MARK_DELETED_AT_TO_FOLDERS_SUCCESS = 'garchen-panel/folder/MARK_DELETED_AT_TO_FOLDERS_SUCCESS';
const MARK_DELETED_AT_TO_FOLDERS_FAIL = 'garchen-panel/folder/MARK_DELETED_AT_TO_FOLDERS_FAIL';

const FOLDER_PERPAGE = 20;

const initialState = Map({
  perpage: FOLDER_PERPAGE,
  folder: null,
  folders: [],
  folderCount: 0,
  isProcessingCsv: false,
  isOpeningDialog: false,
  errorCsvMessage: null,
  errorCsvMessageId: null,
  errorCsvFilename: null,
  importingFolderId: null,

  deletedFolders: [],
  deletedFolderCount: 0,
  deletedFoldersPerPage: DELETE_FOLDER_PERPAGE
});

export default createReducer(initialState, {

  [GET_FOLDER_SUCCESS]: (state, action) => {
    return state.set('folder', action.result);
  },

  [LIST_FOLDERS_SUCCESS]: (state, action) => {
    return state.set('folders', action.result.data)
      .set('folderCount', action.result.total);
  },

  [LIST_DELETED_FOLDERS_SUCCESS]: (state, action) => {
    return state.set('deletedFolders', action.result.data)
      .set('deletedFolderCount', action.result.total);
  },

  [ADD_FOLDER_BY_CSV]: (state) => {
    return state.set('errorCsvMessage', null)
      .set('isOpeningDialog', true)
      .set('errorCsvMessageId', null)
      .set('errorCsvFilename', null);
  },

  [ADD_FOLDER_BY_CSV_SUCCESS]: (state) => {
    return state.set('isProcessingCsv', false)
      .set('isOpeningDialog', false)
      .set('importingFolderId', null);
  },

  [ADD_FOLDER_BY_CSV_FAIL]: (state, action) => {
    const {messageId, filename, message} = action.error;
    return state.set('isProcessingCsv', false)
      .set('isOpeningDialog', false)
      .set('importingFolderId', null)
      .set('errorCsvMessage', message)
      .set('errorCsvMessageId', messageId)
      .set('errorCsvFilename', filename);
  },

  [CANCEL_IMPORTING_CSV_SUCCESS]: (state) => {
    return state.set('isProcessingCsv', false)
      .set('importingFolderId', null)
      .set('errorCsvMessage', null)
      .set('errorCsvMessageId', null)
      .set('errorCsvFilename', null);
  },

  [SET_IMPORTING_FOLDER_ID]: (state, action) => {
    return state.set('importingFolderId', action.folderId);
  },

  [SET_DISPLAY_FOLDER_PERPAGE]: (state, action) => {
    return state.set('perpage', action.perpage);
  },

  [SET_IS_PROCESSING_CSV]: (state, action) => {
    return state.set('isProcessingCsv', action.isProcessingCsv);
  },

  [SET_IS_OPENING_DIALOG]: (state, action) => {
    return state.set('isOpeningDialog', action.isOpeningDialog);
  }
});

export function setIsOpeningDialog(isOpeningDialog) {
  return {
    type: SET_IS_OPENING_DIALOG,
    isOpeningDialog
  };
}

export function setIsProcessingCsv(isProcessingCsv) {
  return {
    type: SET_IS_PROCESSING_CSV,
    isProcessingCsv
  };
}

export function setImportingFolderId(folderId) {
  return {
    type: SET_IMPORTING_FOLDER_ID,
    folderId
  };
}

export function getFolder(data) {
  return {
    types: [GET_FOLDER, GET_FOLDER_SUCCESS, GET_FOLDER_FAIL],
    promise: (client) => client.send('get-folder', data)
  };
}

export function listFolders(data) {
  return {
    types: [LIST_FOLDERS, LIST_FOLDERS_SUCCESS, LIST_FOLDERS_FAIL],
    promise: (client) => client.send('list-folders', data)
  };
}

export function listDeletedFolders(data) {
  data.isDeleted = true;
  return {
    types: [LIST_DELETED_FOLDERS, LIST_DELETED_FOLDERS_SUCCESS, LIST_DELETED_FOLDERS_FAIL],
    promise: (client) => client.send('list-folders', data)
  };
}

export function addFolder(data) {
  return {
    types: [ADD_FOLDER, ADD_FOLDER_SUCCESS, ADD_FOLDER_FAIL],
    promise: (client) => {
      return client.send('add-folder', data);
    }
  };
}

export function updateFolder(data) {
  return {
    types: [UPDATE_FOLDER, UPDATE_FOLDER_SUCCESS, UPDATE_FOLDER_FAIL],
    promise: (client) => {
      return client.send('update-folder', data);
    }
  };
}

export function markDeletedAtToFolders(folderIds) {
  return {
    types: [MARK_DELETED_AT_TO_FOLDERS, MARK_DELETED_AT_TO_FOLDERS_SUCCESS, MARK_DELETED_AT_TO_FOLDERS_FAIL],
    promise: (client) => {
      return client.send('mark-deleted-at-to-folders', {folderIds});
    }
  };
}

export function deleteFolders(folderIds) {
  return {
    types: [DELETE_FOLDERS, DELETE_FOLDERS_SUCCESS, DELETE_FOLDERS_FAIL],
    promise: (client) => {
      return client.send('delete-folders', {folderIds});
    }
  };
}

export function checkFolderExists(data) {
  return {
    types: [CHECK_FOLDER_EXISTS, CHECK_FOLDER_EXISTS_SUCCESS, CHECK_FOLDER_EXISTS_FAIL],
    promise: (client) => {
      return client.send('check-folder-exists', data);
    }
  };
}

export function cancelImportingCsv() {
  return {
    types: [CANCEL_IMPORTING_CSV, CANCEL_IMPORTING_CSV_SUCCESS, CANCEL_IMPORTING_CSV_FAIL],
    promise: (client) => {
      return client.send('cancel-importing-csv');
    }
  };
}

export function addFolderByCsv(writeDelay) {
  return {
    types: [ADD_FOLDER_BY_CSV, ADD_FOLDER_BY_CSV_SUCCESS, ADD_FOLDER_BY_CSV_FAIL],
    promise: (client) => {
      return client.send('add-folder-by-csv', {writeDelay});
    }
  };
}

export function setDisplayFolderPerPage(perpage) {
  return {
    type: SET_DISPLAY_FOLDER_PERPAGE,
    perpage
  };
}

export function exportFolderToCsv(folderId) {
  return {
    types: [EXPORT_FOLDER_TO_CSV, EXPORT_FOLDER_TO_CSV_SUCCESS, EXPORT_FOLDER_TO_CSV_FAIL],
    promise: (client) => {
      return client.send('export-folder-to-csv', {folderId});
    }
  };
}
