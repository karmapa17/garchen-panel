import {formValueSelector} from 'redux-form';

export default function getExplainationLangValues(args) {

  const {currentValue, currentLang, currentIndex, explainationLangs, formName, globalState} = args;
  const selector = formValueSelector(formName);

  return explainationLangs.reduce((map, lang) => {

    const arr = (selector(globalState, `explaination-${lang}`) || []).slice();

    if (currentLang === lang) {
      arr[currentIndex] = currentValue;
    }
    map[lang] = arr;
    return map;
  }, {});
}
