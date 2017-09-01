import React from 'react';
import {range} from 'ramda';
import {Field} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import CATEGORY_VALUES from './../../constants/categoryValues';
import EXPLANATION_CATEGORY_VALUES from './../../constants/explanationCategoryValues';
import SECT_VALUES from './../../constants/sectValues';
import {SELECTED_MENU_STYLE} from './../../constants/constants';

function renderCategoryMenuItems(f) {
  return CATEGORY_VALUES.map(({id, value}) => {
    return <MenuItem key={`category-${id}`} value={value} primaryText={f(id)} />;
  });
}

function renderSectMenuItems(f) {
  return SECT_VALUES.map(({id, value}) => {
    return <MenuItem key={`sect-${id}`} value={value} primaryText={f(id)} />;
  });
}

function renderExplanationCategoryMenuItems(f) {
  return EXPLANATION_CATEGORY_VALUES.map(({id, value}) => {
    return <MenuItem key={`explanation-category-${id}`} value={value} primaryText={f(id)} />;
  });
}

export default function renderContentFields({explanationIndex, explanationLangs, f, contentFields, renderTextField, renderSelectField, handleExplanationChange}) {

  let rows = contentFields.map((field) => {

    const matchTargetLang = field.match(/^target-entry-lang-(.+)$/);

    if (matchTargetLang) {
      const lang = matchTargetLang[1];

      return (
        <div key={`target-entry-${lang}`}>
          <Field name={`target-entry-${lang}`} type="text"
            component={renderTextField} label={f('target-entry-lang', {lang: f(lang)})} />
        </div>
      );
    }

    if ('category' === field) {
      return (
        <div key="category">
          <Field name="category" component={renderSelectField} selectedMenuItemStyle={SELECTED_MENU_STYLE} label={f('category')} fullWidth>
            {renderCategoryMenuItems(f)}
          </Field>
        </div>
      );
    }

    if ('sect' === field) {
      return (
        <div key="sect">
          <Field name="sect" component={renderSelectField} selectedMenuItemStyle={SELECTED_MENU_STYLE} label={f('sect')} fullWidth>
            {renderSectMenuItems(f)}
          </Field>
        </div>
      );
    }

    if ('page-num' === field) {
      return (
        <div key="page-num">
          <Field name="pageNum" type="text" component={renderTextField} label={f('page-num')} fullWidth />
        </div>
      );
    }

    const matchOriginal = field.match(/^original-lang-(.+)$/);

    if (matchOriginal) {
      const lang = matchOriginal[1];

      return (
        <div key={`original-${lang}`}>
          <Field name={`original-${lang}`} type="text" fullWidth
            component={renderTextField} label={f('original-lang', {lang: f(lang)})} multiLine />
        </div>
      );
    }

    const matchSource = field.match(/^source-lang-(.+)$/);

    if (matchSource) {
      const lang = matchSource[1];

      return (
        <div key={`source-${lang}`}>
          <Field name={`source-${lang}`} type="text" fullWidth
            component={renderTextField} label={f('source-lang', {lang: f(lang)})} multiLine />
        </div>
      );
    }
  });

  if (explanationLangs.length > 0) {
    const indices = range(0, explanationIndex);
    rows = rows.concat(indices.map((elem, index) => {

      const explanationLangRows = explanationLangs.map((lang) => {
        return (
          <div key={`explanation-${lang}-${index}`}>
            <Field name={`explanation-${lang}[${index}]`} type="text" fullWidth onChange={handleExplanationChange(lang, index)}
              component={renderTextField} label={f('explanation-num-lang', {lang: f(lang), num: (index + 1)})} multiLine />
          </div>
        );
      });

      explanationLangRows.push((
        <div key={`explanation-extra-info-${index}`}>
          <div key={`explanation-source-${index}`}>
            <Field name={`explanation-source[${index}]`} type="text" fullWidth
              component={renderTextField} label={f('explanation-source-num', {num: (index + 1)})} multiLine />
          </div>
          <div key={`explanation-note-${index}`}>
            <Field name={`explanation-note[${index}]`} type="text" fullWidth
              component={renderTextField} label={f('explanation-note-num', {num: (index + 1)})} multiLine />
          </div>
          <div key={`explanation-category-${index}`}>
            <Field name={`explanation-category[${index}]`} fullWidth selectedMenuItemStyle={SELECTED_MENU_STYLE}
              component={renderSelectField} label={f('explanation-category-num', {num: (index + 1)})} multiple>
              {renderExplanationCategoryMenuItems(f)}
            </Field>
          </div>
        </div>
      ));
      return explanationLangRows;
    }));
  }
  return rows;
}
