import {isEmpty} from 'lodash';

async function searchData({db, field, keyword, folderId, perpage, offset}) {

  const searchQuery = db.knex('Entry').where('data', 'like', `%"${field}":"${keyword}"%`)
    .andWhere('folderId', folderId)
    .limit(perpage)
    .offset(offset);

  const entries = await db.raw(searchQuery, true);

  const countQuery = db.knex('Entry').count('id')
    .where('data', 'like', `%"${field}":"${keyword}"%`)
    .andWhere('folderId', folderId)
    .limit(perpage)
    .offset(offset);

  const total = (await db.raw(countQuery, true))[0]['count("id")'];

  return {entries, total};
}

async function searchSourceEntry({db, keyword, folderId, perpage, offset}) {

  const searchQuery = db.knex('Entry').where('sourceEntry', 'like', `%${keyword}%`)
    .andWhere('folderId', folderId)
    .limit(perpage)
    .offset(offset);

  const entries = await db.raw(searchQuery, true);

  const countQuery = db.knex('Entry').count('id')
    .where('sourceEntry', 'like', `%${keyword}%`)
    .andWhere('folderId', folderId)
    .limit(perpage)
    .offset(offset);

  const total = (await db.raw(countQuery, true))[0]['count("id")'];

  return {entries, total};
}

export default async function listFolderEntries(event, data) {

  const {page, perpage, folderId, type} = data;
  const {db, models} = this.params;
  const {Entry} = models;
  const offset = (page - 1) * perpage;
  const keyword = (data.keyword || '').trim();

  if (isEmpty(keyword)) {
    const entries = await Entry.find({folderId}, {skip: offset, limit: perpage, order: 'id'}) || [];
    const total = await Entry.count({folderId});
    this.resolve({data: entries, total});
    return;
  }

  if ('page-num' === type) {
    const {entries, total} = await searchData({db, field: 'page-num', keyword, folderId, perpage, offset});
    this.resolve({data: entries, total});
    return;
  }

  const {entries, total} = await searchSourceEntry({db, keyword, folderId, perpage, offset});
  this.resolve({data: entries, total});
}
