const regexps = [/^target-entry-lang-(.+)$/, /^explaination-lang-(.+)$/, /^original-lang-(.+)$/];

function matchLang(field) {
  for (let i = 0; i < regexps.length; i++) {
    const re = regexps[i];
    const lang = (re.exec(field) || [])[1];
    if (undefined !== lang) {
      return lang;
    }
  }
  return null;
}

export default function filterFolderContentFields(langs, fields) {
  return fields.filter((field) => {
    const lang = matchLang(field);
    if (lang) {
      return langs.includes(lang);
    }
    return true;
  });
}
