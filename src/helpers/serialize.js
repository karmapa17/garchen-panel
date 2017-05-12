export default function serialize(storage) {
  return {
    ...storage,
    put: (key, state, cb) => storage.put(key, state, cb)
  };
}
