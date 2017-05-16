import getSubset from './getSubset';
import toJson from './toJson';
import CACHED_PROPS from './../constants/cachedProps';

export default function serialize(storage) {
  return {
    ...storage,
    put: (key, state, cb) => {
      const data = getSubset(toJson(state), CACHED_PROPS);
      return storage.put(key, data, cb);
    }
  };
}
