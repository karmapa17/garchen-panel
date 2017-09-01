import floatToPageNum from './../../utils/floatToPageNum';
import pageNumToFloat from './../../utils/pageNumToFloat';
import FRACTION_LENGTH from './../../constants/fractionLength';

export default async function updateEntry(event, rawData) {

  const {Entry} = this.params.models;
  const {id, data} = rawData;

  const sourceEntry = data.sourceEntry;
  const pageNum = pageNumToFloat(data.pageNum, FRACTION_LENGTH) || '';

  delete data.entryId;
  delete data.folderId;
  delete data.sourceEntry;
  delete data.id;
  delete data.pageNum;

  await Entry.update({id}, {sourceEntry, pageNum, data});
  const entry = await Entry.findOne({id});

  entry.pageNum = floatToPageNum(entry.pageNum, FRACTION_LENGTH);

  this.resolve(entry);
}
