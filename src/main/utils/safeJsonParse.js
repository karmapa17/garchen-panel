export default function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  }
  catch (e) {
    return null;
  }
}
