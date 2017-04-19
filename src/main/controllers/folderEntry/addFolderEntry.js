
export default async function addFolderEntry(event, rawData) {

  const {Entry} = this.params.models;
  const {folderId, data} = rawData;

  const sourceEntry = data.sourceEntry;

  delete data.sourceEntry;
  delete data.folderId;

  const entry = await Entry.create({folderId, sourceEntry, data});

  if (! entry) {
    return this.reject({message: 'Failed to create folder entry'});
  }

  this.resolve(entry);
}
