import pageNumToFloat from './../../utils/pageNumToFloat';
import floatToPageNum from './../../utils/floatToPageNum';
import FRACTION_LENGTH from './../../constants/fractionLength';

export default async function addFolderEntry(event, rawData) {

  const {Entry} = this.params.models;
  const {folderId, data} = rawData;

  const sourceEntry = data.sourceEntry;
  const pageNum = pageNumToFloat(data.pageNum, FRACTION_LENGTH) || '';

  delete data.sourceEntry;
  delete data.folderId;
  delete data.pageNum;

  const entry = await Entry.create({folderId, sourceEntry, pageNum, data});

  if (! entry) {
    return this.reject({message: 'Failed to create folder entry'});
  }

  entry.pageNum = floatToPageNum(entry.pageNum, FRACTION_LENGTH);

  this.resolve(entry);
}
