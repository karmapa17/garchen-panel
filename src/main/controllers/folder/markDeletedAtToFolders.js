export default async function markDeletedAtToFolders(event, data) {

  const {folderIds} = data;
  const {db, models} = this.params;

  const deletedAt = Math.round(+new Date() / 1000);

  const query = db.knex('Folder')
    .whereIn('id', folderIds)
    .update({deletedAt});

  await db.raw(query);

  this.resolve({message: `Folders has been marked deletedAt successfully`});
}
