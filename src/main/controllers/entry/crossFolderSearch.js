import {get, isEmpty, isArray} from 'lodash';

async function searchSourceEntry({db, keyword, perpage, offset}) {

  const searchQuery = db.knex('Entry')
    .where('sourceEntry', 'like', `%${keyword}%`)
    .orderBy('folderId', 'asc')
    .limit(perpage)
    .offset(offset);

  const entries = await db.raw(searchQuery, true);

  const countQuery = db.knex('Entry').count('id')
    .where('sourceEntry', 'like', `%${keyword}%`);

  const res = await db.raw(countQuery, true);
  const total = get(res, '[0][\'count("id")\']', 0);

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
  const keyword = (data.keyword || '').trim();

  if (isEmpty(keyword)) {
    this.resolve({folders: [], total: 0});
    return;
  }
  const {entries, total} = await searchSourceEntry({db, keyword, perpage, offset});

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
