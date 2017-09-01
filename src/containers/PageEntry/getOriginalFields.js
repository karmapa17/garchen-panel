export default function getOriginalFields({fieldMap, targetLanguages}) {
  return targetLanguages.filter((lang) => fieldMap[`original-lang-${lang}`])
    .map((lang) => ({prop: `original-${lang}`, lang}));
}
