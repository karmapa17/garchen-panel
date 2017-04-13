export default async function getFolder(event, data) {

  const {Folder} =  this.params.models;
  const folder = await Folder.findOne({id: data.id});

  this.resolve(folder);
}
