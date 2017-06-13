import padPageNumWithZeros from './../../helpers/padPageNumWithZeros';
import trimFractionLeadingZeros from './../../helpers/trimFractionLeadingZeros';
import FRACTION_LENGTH from './../../constants/fractionLength';

export default async function addFolderEntry(event, rawData) {

  const {Entry} = this.params.models;
  const {folderId, data} = rawData;

  const sourceEntry = data.sourceEntry;
  const pageNum = padPageNumWithZeros(data.pageNum, FRACTION_LENGTH);

  delete data.sourceEntry;
  delete data.folderId;
  delete data.pageNum;

  const entry = await Entry.create({folderId, sourceEntry, pageNum, data});

  if (! entry) {
    return this.reject({message: 'Failed to create folder entry'});
  }

  entry.pageNum = trimFractionLeadingZeros(entry.pageNum);

  this.resolve(entry);
}
