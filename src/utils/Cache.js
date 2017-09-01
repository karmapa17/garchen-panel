export default class Cache {

  static get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    }
    catch (err) {
      return null;
    }
  }

  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
