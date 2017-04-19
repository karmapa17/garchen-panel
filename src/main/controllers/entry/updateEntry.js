export default async function updateEntry(event, rawData) {

  const {Entry} = this.params.models;
  const {id, data} = rawData;

  const sourceEntry = data.sourceEntry;
  delete data.sourceEntry;
  delete data.id;

  await Entry.update({id}, {sourceEntry, data});

  this.resolve({});
}
