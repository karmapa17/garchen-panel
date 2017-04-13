import log from 'karmapa-log';
import {cloneDeep} from 'lodash';

export default async function addFolder(event, rawData) {

  const data = cloneDeep(rawData);
  const {Folder} =  this.params.models;

  delete data.folderName;

  try {
    const folder = await Folder.create({
      name: rawData.folderName,
      fields: data
    });
    this.resolve(folder);
  }
  catch (err) {
    log.error(err);
    this.reject({message: 'Failed to create folder.'});
  }
}
