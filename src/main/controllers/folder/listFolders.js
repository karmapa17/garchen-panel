export default async function listFolders(event, data) {
  const {Folder} =  this.params.models;
  const folders = await Folder.find();

  this.resolve(folders);
}
