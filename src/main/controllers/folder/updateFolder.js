import log from 'karmapa-log';
import {cloneDeep} from 'lodash';

export default async function updateFolder(event, rawData) {

  const data = cloneDeep(rawData);
  const {Folder} =  this.params.models;

  delete data.id;
  delete data.folderName;

  const columns = {
    name: rawData.folderName,
    fields: data
  };

  await Folder.update({id: rawData.id}, columns);
  columns.id = rawData.id;
  this.resolve(columns);
}
