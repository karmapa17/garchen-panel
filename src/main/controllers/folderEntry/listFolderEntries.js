export default async function listFolderEntries(event, data) {

  const {page, perpage, folderId} = data;
  const {Entry} = this.params.models;

  const entries = await Entry.find({folderId}, {skip: (page - 1) * perpage, limit: perpage, order: 'id'}) || [];
  const total = await Entry.count({folderId});

  this.resolve({data: entries, total});
}
