export default async function deleteFolder(event, data) {

  const {folderIds} = data;
  const {db, models} = this.params;
  const {Folder, Entry} = models;

  await db.raw(db.knex('Folder').whereIn('id', folderIds).del());
  await db.raw(db.knex('Entry').whereIn('folderId', folderIds).del());

  this.resolve({message: `Folders has been deleted`});
}
