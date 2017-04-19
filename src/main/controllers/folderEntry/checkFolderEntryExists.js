export default async function checkFolderEntryExists(event, data) {

  const {Entry} =  this.params.models;
  const {folderId, sourceEntry, entryId} = data;

  const entry = await Entry.findOne({folderId, sourceEntry});

  if (entryId) {
    this.resolve({folderEntryExisted: (!! entry) && (entry.id !== entryId)});
  }
  else {
    this.resolve({folderEntryExisted: (!! entry)});
  }
}
