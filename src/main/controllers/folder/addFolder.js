import log from 'karmapa-log';

export default async function addFolder(event, data) {
  const {Folder} =  this.params.models;
  try {
    const folder = await Folder.create({
      name: data.folderName,
      fields: data
    });
    this.resolve(folder);
  }
  catch (err) {
    log.error(err);
    this.reject({message: 'Failed to create folder.'});
  }
}
