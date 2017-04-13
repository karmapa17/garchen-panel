import {checkFolderExists} from './../../redux/modules/folder';

export default function addFolderFormAsyncValidate(values, dispatch) {

  const {folderName} = values;

  if (folderName) {
    return dispatch(checkFolderExists({folderName}))
      .then((res) => {
        if (res.folderExisted) {
          return Promise.reject({folderName: {id: 'folder-name-taken', params: {folderName}}});
        }
      });
  }
  return Promise.reject({folderName: {id: 'folder-name-required', params: {folderName}}});
}
