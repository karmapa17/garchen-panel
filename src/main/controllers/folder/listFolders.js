export default async function listFolders(event, data) {

  const {page, perpage} = data;
  const {Folder} =  this.params.models;

  const folders = await Folder.find({}, {skip: (page - 1) * perpage, limit: perpage});
  const total = await Folder.count();

  this.resolve({data: folders, total});
}
