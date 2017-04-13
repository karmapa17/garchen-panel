import log from 'karmapa-log';
import {cloneDeep} from 'lodash';

export default async function updateFolder(event, rawData) {

  const data = cloneDeep(rawData);
  const {Folder} =  this.params.models;

  delete data.id;
  delete data.folderName;

  try {
    const folder = await Folder.update({id: rawData.id}, {
      name: rawData.folderName,
      fields: data
    });
    this.resolve(folder);
  }
  catch (err) {
    log.error(err);
    this.reject({message: `Failed to update folder ${rawData.id}.`});
  }
}
