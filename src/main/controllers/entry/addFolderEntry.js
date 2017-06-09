
export default async function addFolderEntry(event, rawData) {

  const {Entry} = this.params.models;
  const {folderId, data} = rawData;

  const sourceEntry = data.sourceEntry;
  const pageNum = data.pageNum;

  delete data.sourceEntry;
  delete data.folderId;
  delete data.pageNum;

  const entry = await Entry.create({folderId, sourceEntry, pageNum, data});

  if (! entry) {
    return this.reject({message: 'Failed to create folder entry'});
  }

  this.resolve(entry);
}
