import {isEmpty} from 'lodash';

export default async function deleteFolder(event, data) {

  const {ids} = data;
  const {db} = this.params;

  if (isEmpty(ids)) {
    throw new Error('no id specified.');
  }

  const query = db.knex('Entry')
    .whereIn('id', ids)
    .del();

  const res = await db.raw(query, true);

  this.resolve({message: `Entry ${ids.join(',')} has been deleted`});
}
