import trimFractionLeadingZeros from './../../helpers/trimFractionLeadingZeros';
import padPageNumWithZeros from './../../helpers/padPageNumWithZeros';
import FRACTION_LENGTH from './../../constants/fractionLength';

export default async function updateEntry(event, rawData) {

  const {Entry} = this.params.models;
  const {id, data} = rawData;

  const sourceEntry = data.sourceEntry;
  const pageNum = padPageNumWithZeros(data.pageNum, FRACTION_LENGTH) || '';

  delete data.entryId;
  delete data.folderId;
  delete data.sourceEntry;
  delete data.id;
  delete data.pageNum;

  await Entry.update({id}, {sourceEntry, pageNum, data});
  const entry = await Entry.findOne({id});

  entry.pageNum = trimFractionLeadingZeros(entry.pageNum);

  this.resolve(entry);
}
