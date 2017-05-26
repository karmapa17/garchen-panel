import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import {range} from 'ramda';

import injectMuiReduxFormHelper from './../../helpers/injectMuiReduxFormHelper';
import injectF from './../../helpers/injectF';
import asyncValidate from './editEntryFormAsyncValidate';
import CATEGORY_VALUES from './../../constants/categoryValues';
import SECT_VALUES from './../../constants/sectValues';
import EXPLANATION_CATEGORY_VALUES from './../../constants/explanationCategoryValues';
import {SELECTED_MENU_STYLE} from './../../constants/constants';

// helpers that are shared between AddEntryForm and EditEntryForm
import getNextExplanationIndex from './../AddEntryForm/getNextExplanationIndex';
import getExplanationLangs from './../AddEntryForm/getExplanationLangs';
import getExplanationLangValues from './../AddEntryForm/getExplanationLangValues';

const styles = require('./EditEntryForm.scss');

@reduxForm({
  form: 'editEntryForm',
  asyncValidate
})
@injectF
@injectMuiReduxFormHelper
export default class EditEntryForm extends Component {

  static propTypes = {
    folder: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    renderTextField: PropTypes.func.isRequired,
    renderSelectField: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    f: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const {folder, initialValues} = props;
    const {contentFields, targetLanguages} = folder.data;
    const explanationLangs = getExplanationLangs(contentFields);

    this.state = {
      explanationIndex: this.getInitialExplanationIndex(initialValues, targetLanguages),
      explanationLangs
    };
  }

  getInitialExplanationIndex(fields, targetLanguages) {
    return Object.keys(fields).reduce((initialIndex, field) => {
      const lang = (field.match(/^explanation-(.+)$/) || [])[1];
      if (targetLanguages.includes(lang)) {
        const arr = fields[field];
        const nextIndex = arr.length + 1;
        if (nextIndex > initialIndex) {
          return nextIndex;
        }
      }
      return initialIndex;
    }, 0);
  }

  getExplanationIndex = (lang) => `explanation-${lang}-index`;

  renderCategoryMenuItems() {
    const {f} = this.props;
    return CATEGORY_VALUES.map(({id, value}) => {
      return <MenuItem key={`category-${id}`} value={value} primaryText={f(id)} />;
    });
  }

  renderSectMenuItems() {
    const {f} = this.props;
    return SECT_VALUES.map(({id, value}) => {
      return <MenuItem key={`sect-${id}`} value={value} primaryText={f(id)} />;
    });
  }

  handleExplanationChange = (lang, index) => {
    return (event) => {
      const {explanationLangs, explanationIndex} = this.state;
      const langValues = getExplanationLangValues({
        currentValue: event.target.value,
        currentLang: lang,
        currentIndex: index,
        explanationLangs: this.state.explanationLangs,
        formName: 'editEntryForm',
        globalState: this.context.store.getState()
      });
      const nextIndex = getNextExplanationIndex({
        langValues,
        explanationLangs,
        explanationIndex
      });
      this.setState({explanationIndex: nextIndex});
    };
  };

  renderExplanationCategoryMenuItems() {
    const {f} = this.props;
    return EXPLANATION_CATEGORY_VALUES.map(({id, value}) => {
      return <MenuItem key={`explanation-category-${id}`} value={value} primaryText={f(id)} />;
    });
  }

  renderContentFields() {

    const {explanationIndex, explanationLangs} = this.state;
    const {folder, f, renderTextField, renderSelectField} = this.props;
    const {contentFields} = folder.data;

    let rows = contentFields.map((field) => {

      const matchTargetLanguage = field.match(/^target-entry-lang-(.+)$/);

      if (matchTargetLanguage) {
        const lang = matchTargetLanguage[1];

        return (
          <div key={`target-entry-${lang}`}>
            <Field name={`target-entry-${lang}`} type="text" fullWidth
              component={renderTextField} label={f('target-entry-lang', {lang: f(lang)})} />
          </div>
        );
      }

      if ('category' === field) {
        return (
          <div key="category">
            <Field name="category" component={renderSelectField} selectedMenuItemStyle={SELECTED_MENU_STYLE}
              label={f('category')} fullWidth>
              {this.renderCategoryMenuItems()}
            </Field>
          </div>
        );
      }

      if ('sect' === field) {
        return (
          <div key="sect">
            <Field name="sect" component={renderSelectField} selectedMenuItemStyle={SELECTED_MENU_STYLE}
              label={f('sect')} fullWidth>
              {this.renderSectMenuItems()}
            </Field>
          </div>
        );
      }

      if ('page-num' === field) {
        return (
          <div key="page-num">
            <Field name="page-num" type="text" component={renderTextField} label={f('page-num')} fullWidth />
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
              <Field name={`explanation-${lang}[${index}]`} type="text" fullWidth onChange={this.handleExplanationChange(lang, index)}
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
                {this.renderExplanationCategoryMenuItems()}
              </Field>
            </div>
          </div>
        ));
        return explanationLangRows;
      }));
    }

    return rows;
  }

  render() {

    const {handleSubmit, f, invalid, renderTextField, folder} = this.props;
    const {sourceLanguage} = folder.data;

    return (
      <form className={styles.editEntryForm} onSubmit={handleSubmit}>
        <div className={styles.formBody}>
          <div>
            <Field name="sourceEntry" type="text" component={renderTextField}
            label={f('source-entry-lang', {lang: f(sourceLanguage)})} autoFocus fullWidth />
          </div>
          <div>{this.renderContentFields()}</div>
        </div>
        <RaisedButton className={styles.submitButton} type="submit" label={f('submit')} primary disabled={invalid} />
      </form>
    );
  }
}
