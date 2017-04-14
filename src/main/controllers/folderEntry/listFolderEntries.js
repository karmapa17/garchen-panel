export default async function listFolderEntries(event, data) {

  const {page, perpage, folderId} = data;
  const {Entry} =  this.params.models;

  const entries = await Entry.find({id: folderId}, {skip: (page - 1) * perpage, limit: perpage}) || [];
  const total = await Entry.count({id: folderId});

  this.resolve({data: entries, total});
}
