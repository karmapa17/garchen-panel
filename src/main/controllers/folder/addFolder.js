import {pick, isEmpty} from 'lodash';

export default async function addFolder(event, data) {

  const {Folder} =  this.params.models;

  const folder = await Folder.create({
    name: data.folderName,
    source: data.source || '',
    data: pick(data, ['sourceLanguage', 'targetLanguages', 'contentFields'])
  });

  if (isEmpty(folder)) {
    return this.reject({message: 'Failed to create folder'});
  }

  this.resolve(folder);
}
