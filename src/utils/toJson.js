import {isFunction, get} from 'lodash';

export default function toJson(data) {
  return Object.entries(data)
    .reduce((obj, [prop, value]) => {
      const hasToJson = isFunction(get(value, 'toJSON'));
      obj[prop] = hasToJson ? value.toJSON() : value;
      return obj;
    }, {});
}
