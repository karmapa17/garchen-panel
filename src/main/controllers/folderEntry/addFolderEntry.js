export default async function addFolderEntry(event, rawData) {

  const {data, folderId, sourceEntry} = rawData;
  const {Entry} =  this.params.models;

  const folderEntry = await Entry.create({
    folderId,
    sourceEntry,
    data
  });

  if (! folderEntry) {
    return this.reject({message: 'Failed to create folder entry'});
  }

  this.resolve(folderEntry);
}
