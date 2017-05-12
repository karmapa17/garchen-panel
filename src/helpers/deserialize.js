import {Map} from 'immutable';

export default function deserialize(state, payload) {
  return Object.entries(state)
    .reduce((obj, [prop, value]) => {
      const cachedValue = payload[prop];
      obj[prop] = Map.isMap(value) ? Map(cachedValue) : cachedValue;
      return obj;
    }, {});
}
