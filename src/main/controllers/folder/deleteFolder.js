import log from 'karmapa-log';

export default async function deleteFolder(event, data) {

  const {id} = data;
  const {Folder, Entry} =  this.params.models;

  await Folder.remove({id});
  await Entry.remove({folderId: id});

  this.resolve({message: `Folder ${id} has been deleted`});
}
