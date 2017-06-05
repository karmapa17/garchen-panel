export default async function listFolders(event, data) {

  const {page, perpage, isDeleted} = data;
  const {Folder} =  this.params.models;
  const where = isDeleted ? ['deletedAt', '>', 0] : {deletedAt: 0};

  const folders = await Folder.find(null, where, {skip: (page - 1) * perpage, limit: perpage});
  const total = await Folder.count();

  this.resolve({data: folders, total});
}
