import getSubset from './getSubset';
import toJson from './toJson';

export default function serialize(storage) {
  return {
    ...storage,
    put: (key, state, cb) => {
      const data = getSubset(toJson(state), ['main.appLocale', 'main.writeDelay']);
      return storage.put(key, data, cb);
    }
  };
}
