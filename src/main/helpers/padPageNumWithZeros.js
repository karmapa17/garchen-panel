import zpad from 'zpad';
/**
 * This function pad a fraction with leading zero
 * For example, it converts 1.2 to 1.002 when length argument is 3
 */
export default function padPageNumWithZeros(numStr, length) {

  const [, wholeNumStr, fractionStr] = /^(\d+)\.(\d+)$/.exec(numStr) || [];

  if (undefined === fractionStr) {
    return numStr;
  }

  const fraction = zpad(parseInt(fractionStr, 10), length);

  return `${wholeNumStr}.${fraction}`;
}
