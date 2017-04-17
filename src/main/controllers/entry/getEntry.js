export default async function getEntry(event, data) {

  const {id} = data;
  const {Entry} = this.params.models;
  const entry = await Entry.findOne({id});

  this.resolve(entry);
}
