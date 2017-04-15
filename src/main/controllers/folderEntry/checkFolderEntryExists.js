export default async function checkFolderEntryExists(event, data) {

  const {Entry} =  this.params.models;
  const {folderId, sourceEntry} = data;

  const entry = await Entry.findOne({folderId, sourceEntry});

  this.resolve({folderEntryExisted: (!! entry)});
}
