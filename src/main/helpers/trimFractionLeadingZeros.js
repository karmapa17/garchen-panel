export default function trimFractionLeadingZeros(floatNum, length) {

  const numStr = String(floatNum);
  const [, wholeNumStr, fractionStr] = /^(\d+)\.(\d+)$/.exec(numStr) || [];

  if (undefined === fractionStr) {
    return numStr;
  }

  const filledFractionStr = fractionStr + '0'.repeat(length - fractionStr.length);
  const fraction = parseInt(filledFractionStr, 10);

  return `${wholeNumStr}.${fraction}`;
}
