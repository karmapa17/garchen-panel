export default async function updateEntry(event, rawData) {

  const {Entry} = this.params.models;
  const {id, data} = rawData;

  const sourceEntry = data.sourceEntry;

  delete data.entryId;
  delete data.folderId;
  delete data.sourceEntry;
  delete data.id;

  await Entry.update({id}, {sourceEntry, data});
  const entry = await Entry.findOne({id});

  this.resolve(entry);
}
