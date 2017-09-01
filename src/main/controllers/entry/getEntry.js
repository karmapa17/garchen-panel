import {get, isEmpty} from 'lodash';
import floatToPageNum from './../../utils/floatToPageNum';
import FRACTION_LENGTH from './../../constants/fractionLength';

async function getNextEntryId({entry, db}) {

  const query = db.knex('Entry')
    .select('id')
    .where('id', '>', entry.id)
    .andWhere('folderId', entry.folderId)
    .orderBy('id', 'asc')
    .limit(1);

  const res = await db.raw(query, true);
  return get(res, '[0].id');
}

async function getPrevEntryId({entry, db}) {

  const query = db.knex('Entry')
    .select('id')
    .where('id', '<', entry.id)
    .andWhere('folderId', entry.folderId)
    .orderBy('id', 'desc')
    .limit(1);

  const res = await db.raw(query, true);
  return get(res, '[0].id');
}

export default async function getEntry(event, data) {

  const {id} = data;
  const {db, models} = this.params;
  const {Entry} = models;

  const entry = await Entry.findOne({id});

  if (isEmpty(entry)) {
    this.reject({message: 'entry not found'});
    return;
  }

  entry.pageNum = floatToPageNum(entry.pageNum, FRACTION_LENGTH);

  const nextEntryId = await getNextEntryId({entry, db});
  const prevEntryId = await getPrevEntryId({entry, db});

  this.resolve({
    entry,
    nextEntryId,
    prevEntryId
  });
}
