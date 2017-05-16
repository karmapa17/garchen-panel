export default function getFontSize(scalingFactor, em) {
  return `${(scalingFactor * em).toFixed(2)}em`;
}
