export default function deleteFolderFormValidate(values) {

  const errors = {};

  if (values.folderName !== values.targetFolderName) {
    errors.folderName = {id: 'please-input-exact-the-same-folder-name', params: {folderName: values.targetFolderName}};
  }

  return errors;
}
