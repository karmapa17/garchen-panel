import {pick} from 'lodash';

export default async function updateFolder(event, data) {

  const {Folder} =  this.params.models;

  const newData = {
    name: data.folderName,
    data: pick(data, ['sourceLanguage', 'targetLanguages', 'contentFields'])
  };

  await Folder.update({id: data.id}, newData);
  newData.id = data.id;

  this.resolve(newData);
}
