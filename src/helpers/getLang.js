export default function getLang() {
  return localStorage.getItem('garchen:lang') || 'zh-TW';
}
