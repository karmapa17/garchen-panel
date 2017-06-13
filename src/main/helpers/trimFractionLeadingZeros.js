export default function trimFractionLeadingZeros(numStr) {

  const [, wholeNumStr, fractionStr] = /^(\d+)\.(\d+)$/.exec(numStr) || [];

  if (undefined === fractionStr) {
    return numStr;
  }
  const fraction = parseInt(fractionStr, 10);

  return `${wholeNumStr}.${fraction}`;
}
