export default async function clearRecycleBin(event) {

  const {db, models} = this.params;
  const {Folder} = models;

  const folderIds = await Folder.find('id', ['deletedAt', '>', 0]);
  await db.raw(db.knex('Folder').whereIn('id', folderIds).del());
  await db.raw(db.knex('Entry').whereIn('folderId', folderIds).del());

  this.resolve({message: `Folders has been deleted`});
}
