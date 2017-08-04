import zpad from 'zpad';
/**
 * This function pad a fraction with leading zero
 * For example, it converts 1.2 to 1.02 when the argument length is 2
 */
export default function pageNumToFloat(num, length) {

  const numStr = String(num);
  const [, wholeNumStr, fractionStr] = /^(\d+)\.(\d+)$/.exec(numStr) || [];

  if (undefined === fractionStr) {
    return numStr;
  }
  const fraction = zpad(parseInt(fractionStr, 10), length);
  return parseFloat(`${wholeNumStr}.${fraction}`);
}
