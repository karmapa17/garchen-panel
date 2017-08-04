import {get, isEmpty} from 'lodash';
import parseJsonFields from './../../helpers/parseJsonFields';
import floatToPageNum from './../../helpers/floatToPageNum';
import pageNumToFloat from './../../helpers/pageNumToFloat';
import FRATION_LENGTH from './../../constants/fractionLength';

const trimPageNumZeros = (entry) => {
  entry.pageNum = floatToPageNum(entry.pageNum, FRATION_LENGTH);
  return entry;
};

async function searchSourceEntry({db, searchKeyword, folderId, perpage, offset}) {

  const searchQuery = db.knex('Entry').where('sourceEntry', 'like', `%${searchKeyword}%`)
    .andWhere('folderId', folderId)
    .limit(perpage)
    .offset(offset);

  const rows = await db.raw(searchQuery, true);
  let entries = parseJsonFields('data', rows);

  entries = entries.map(trimPageNumZeros);

  const countQuery = db.knex('Entry').count('id')
    .where('sourceEntry', 'like', `%${searchKeyword}%`)
    .andWhere('folderId', folderId);

  const res = await db.raw(countQuery, true);
  const total = get(res, '[0][\'count("id")\']', 0);

  return {entries, total};
}

export default async function listFolderEntries(event, data) {

  const {page, perpage, folderId, searchType, pageNumSortMethod} = data;
  const {db, models} = this.params;
  const {Entry} = models;
  const offset = (page - 1) * perpage;
  const searchKeyword = (data.searchKeyword || '').trim();

  let order = ['id', 'asc'];

  if (pageNumSortMethod) {
    order = ['pageNum', pageNumSortMethod];
  }

  if (isEmpty(searchKeyword)) {
    let entries = await Entry.find({folderId}, {skip: offset, limit: perpage, order}) || [];
    entries = entries.map(trimPageNumZeros);
    const total = await Entry.count({folderId});
    this.resolve({data: entries, total});
    return;
  }

  if ('page-num' === searchType) {
    const pageNum = pageNumToFloat(searchKeyword, FRATION_LENGTH);
    let entries = await Entry.find({folderId, pageNum}, {skip: offset, limit: perpage, order}) || [];
    entries = entries.map(trimPageNumZeros);
    const total = await Entry.count({folderId, pageNum});
    this.resolve({data: entries, total});
    return;
  }

  const {entries, total} = await searchSourceEntry({db, searchKeyword, folderId, perpage, offset});
  this.resolve({data: entries, total});
}
