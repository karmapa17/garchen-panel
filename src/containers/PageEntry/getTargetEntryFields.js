export default function getTargetEntryFields({fieldMap, targetLanguages}) {
  return targetLanguages.filter((lang) => fieldMap[`target-entry-lang-${lang}`])
    .map((lang) => ({prop: `target-entry-${lang}`, lang}));
}
