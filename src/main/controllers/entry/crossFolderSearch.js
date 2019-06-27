import {get, isEmpty, isArray} from 'lodash';

async function searchSourceEntry({db, searchKeyword, perpage, offset}) {

  const searchQuery = db.knex('Entry')
    .select(['Entry.id as pk', '*'])
    .leftJoin('Folder', 'Entry.folderId', 'Folder.id')
    .where('sourceEntry', 'like', `${searchKeyword}%`)
    .andWhere('Folder.deletedAt', 0)
    .orderBy('folderId', 'asc')
    .limit(perpage)
    .offset(offset);

  const entries = (await db.raw(searchQuery, true)).map((entry) => {
    const id = entry.pk;
    delete entry.pk;
    return Object.assign({}, entry, {id});
  });

  const countQuery = db.knex('Entry')
    .leftJoin('Folder', 'Entry.folderId', 'Folder.id')
    .count('Entry.id')
    .where('sourceEntry', 'like', `${searchKeyword}%`)
    .andWhere('Folder.deletedAt', 0);

  const res = await db.raw(countQuery, true);
  const total = get(res, '[0][\'count("Entry"."id")\']', 0);

  return {entries, total};
}

async function getFoldersByFolderIds({db, folderIds = []}) {

  const query = db.knex('Folder')
    .whereIn('id', folderIds);

  return await db.raw(query, true);
}

export default async function crossFolderSearch(event, data) {

  const {page, perpage} = data;
  const {db, models} = this.params;
  const {Entry} = models;
  const offset = (page - 1) * perpage;
  const searchKeyword = (data.searchKeyword || '').trim();

  if (isEmpty(searchKeyword)) {
    this.resolve({folders: [], total: 0});
    return;
  }
  const {entries, total} = await searchSourceEntry({db, searchKeyword, perpage, offset});

  const folderIds = entries.reduce((ids, entry) => {
    if (! ids.includes(entry.folderId)) {
      ids.push(entry.folderId);
    }
    return ids;
  }, []);

  const folders = await getFoldersByFolderIds({db, folderIds});
  const folderData = folders.reduce((obj, folder) => {
    obj[folder.id] = folder;
    return obj;
  }, {});

  entries.forEach((entry) => {
    const folder = folderData[entry.folderId];
    if (! isArray(folder.entries)) {
      folder.entries = [];
    }
    folder.entries.push(entry);
  });

  this.resolve({folders, total});
}
