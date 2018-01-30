import {pick, isEmpty} from 'lodash';
import dateTime from 'date-time';

export default async function addFolder(event, data) {

  const {Folder} =  this.params.models;
  const buildDate = dateTime();

  const folder = await Folder.create({
    name: data.folderName,
    source: data.source || '',
    coverPic: '',
    data: pick(data, ['sourceLanguage', 'targetLanguages', 'contentFields']),
    dateInfo: buildDate
  });

  if (isEmpty(folder)) {
    return this.reject({message: 'Failed to create folder'});
  }

  this.resolve(folder);
}
