import {checkFolderEntryExists} from './../../redux/modules/folderEntry';

export default function addFolderEntryFormAsyncValidate(values, dispatch) {

  const {sourceEntry, folderId, entryId} = values;

  if (sourceEntry) {
    return dispatch(checkFolderEntryExists({sourceEntry, folderId, entryId}))
      .then((res) => {

        if (res.folderEntryExisted) {
          return Promise.reject({
            sourceEntry: {
              id: 'folder-entry-name-taken',
              params: {sourceEntry}
            }
          });
        }
      });
  }

  return Promise.reject({
    sourceEntry: {
      id: 'folder-entry-name-required',
      params: {sourceEntry}
    }
  });
}
