import {formValueSelector} from 'redux-form';

export default function getExplanationLangValues(args) {

  const {currentValue, currentLang, currentIndex, explanationLangs, formName, globalState} = args;
  const selector = formValueSelector(formName);

  return explanationLangs.reduce((map, lang) => {

    const arr = (selector(globalState, `explanation-${lang}`) || []).slice();

    if (currentLang === lang) {
      arr[currentIndex] = currentValue;
    }
    map[lang] = arr;
    return map;
  }, {});
}
