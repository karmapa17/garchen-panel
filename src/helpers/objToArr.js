export default function objToArr(obj) {
  return Object.keys(obj).map((key) => obj[key]);
}
