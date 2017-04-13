import {checkFolderExists} from './../../redux/modules/folder';

export default function editFolderFormAsyncValidate(values, dispatch) {

  const {folderName, id} = values;

  if (folderName) {
    return dispatch(checkFolderExists({folderName, id}))
      .then((res) => {
        if (res.folderExisted) {
          return Promise.reject({folderName: {id: 'folder-name-taken', params: {folderName}}});
        }
      });
  }
  return Promise.reject({folderName: {id: 'folder-name-required', params: {folderName}}});
}
