export default async function restoreFolders(event, data) {

  const {folderIds} = data;
  const {db} = this.params;

  const query = db.knex('Folder')
    .whereIn('id', folderIds)
    .update({deletedAt: 0});

  await db.raw(query);

  this.resolve({message: `Folders have been restored successfully`});
}
