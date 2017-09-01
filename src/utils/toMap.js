export default function toMap(arr) {
  return arr.reduce((obj, key) => {
    obj[key] = true;
    return obj;
  }, {});
}
