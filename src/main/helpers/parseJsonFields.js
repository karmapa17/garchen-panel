import {isArray} from 'lodash';
import safeJsonParse from './safeJsonParse';

export default function parseJsonFields(rawFields, rows) {

  const fields = isArray(rawFields) ? rawFields : [rawFields];

  return rows.map((row) => {
      return fields.reduce((row, field) => {
        row[field] = safeJsonParse(row[field]);
        return row;
      }, Object.assign({}, row));
    });
}
