export default async function updateEntry(event, rawData) {

  const {Entry} = this.params.models;
  const {id, data} = rawData;

  const sourceEntry = data.sourceEntry;
  const pageNum = data.pageNum;

  delete data.entryId;
  delete data.folderId;
  delete data.sourceEntry;
  delete data.id;
  delete data.pageNum;

  await Entry.update({id}, {sourceEntry, pageNum, data});
  const entry = await Entry.findOne({id});

  this.resolve(entry);
}
