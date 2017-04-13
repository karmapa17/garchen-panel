import log from 'karmapa-log';
import {cloneDeep} from 'lodash';

export default async function updateFolder(event, rawData) {

  console.log('???', data, rawData);

  const data = cloneDeep(rawData);
  const {Folder} =  this.params.models;

  delete data.id;
  delete data.folderName;

  const columns = {
    name: rawData.folderName,
    fields: data
  };

  try {
    await Folder.update({id: rawData.id}, columns);
    columns.id = rawData.id;
    this.resolve(columns);
  }
  catch (err) {
    log.error(err);
    this.reject({message: `Failed to update folder ${rawData.id}.`});
  }
}
