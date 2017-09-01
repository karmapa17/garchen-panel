export default function getExplanationFields({fieldMap, targetLanguages}) {
  return targetLanguages.filter((lang) => fieldMap[`explanation-lang-${lang}`])
    .map((lang) => ({prop: `explanation-${lang}`, lang}));
}
