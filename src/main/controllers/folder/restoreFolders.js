export default async function restoreFolders(event, data) {

  const {folderIds} = data;
  const {db} = this.params;
  await db.raw(db.knex('Folder').whereIn('id', folderIds).update({deletedAt: 0}));

  this.resolve({message: `Folders have been restored successfully`});
}
