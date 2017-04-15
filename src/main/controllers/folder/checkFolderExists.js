export default async function checkFolderExists(event, data) {

  const {Folder} =  this.params.models;
  const {id, folderName} = data;

  const folder = await Folder.findOne({
    name: folderName
  });

  // for folder edit page
  if (folder && (id === folder.id)) {
    this.resolve({folderExisted: false});
  }

  this.resolve({folderExisted: (!! folder)});
}
