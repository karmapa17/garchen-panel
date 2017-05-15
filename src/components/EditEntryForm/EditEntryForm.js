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
import EXPLAINATION_CATEGORY_VALUES from './../../constants/explainationCategoryValues';
import {SELECTED_MENU_STYLE} from './../../constants/constants';

// helpers that are shared between AddEntryForm and EditEntryForm
import getNextExplainationIndex from './../AddEntryForm/getNextExplainationIndex';
import getExplainationLangs from './../AddEntryForm/getExplainationLangs';
import getExplainationLangValues from './../AddEntryForm/getExplainationLangValues';

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
    const explainationLangs = getExplainationLangs(contentFields);

    this.state = {
      explainationIndex: this.getInitialExplainationIndex(initialValues, targetLanguages),
      explainationLangs
    };
  }

  getInitialExplainationIndex(fields, targetLanguages) {
    return Object.keys(fields).reduce((initialIndex, field) => {
      const lang = (field.match(/^explaination-(.+)$/) || [])[1];
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

  getExplainationIndex = (lang) => `explaination-${lang}-index`;

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

  handleExplainationChange = (lang, index) => {
    return (event) => {
      const {explainationLangs, explainationIndex} = this.state;
      const langValues = getExplainationLangValues({
        currentValue: event.target.value,
        currentLang: lang,
        currentIndex: index,
        explainationLangs: this.state.explainationLangs,
        formName: 'editEntryForm',
        globalState: this.context.store.getState()
      });
      const nextIndex = getNextExplainationIndex({
        langValues,
        explainationLangs,
        explainationIndex
      });
      this.setState({explainationIndex: nextIndex});
    };
  };

  renderExplainationCategoryMenuItems() {
    const {f} = this.props;
    return EXPLAINATION_CATEGORY_VALUES.map(({id, value}) => {
      return <MenuItem key={`explaination-category-${id}`} value={value} primaryText={f(id)} />;
    });
  }

  renderContentFields() {

    const {explainationIndex, explainationLangs} = this.state;
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

    if (explainationLangs.length > 0) {
      const indices = range(0, explainationIndex);
      rows = rows.concat(indices.map((elem, index) => {

        const explainationLangRows = explainationLangs.map((lang) => {
          return (
            <div key={`explaination-${lang}-${index}`}>
              <Field name={`explaination-${lang}[${index}]`} type="text" fullWidth onChange={this.handleExplainationChange(lang, index)}
                component={renderTextField} label={f('explaination-num-lang', {lang: f(lang), num: (index + 1)})} multiLine />
            </div>
          );
        });

        explainationLangRows.push((
          <div key={`explaination-extra-info-${index}`}>
            <div key={`explaination-source-${index}`}>
              <Field name={`explaination-source[${index}]`} type="text" fullWidth
                component={renderTextField} label={f('explaination-source-num', {num: (index + 1)})} multiLine />
            </div>
            <div key={`explaination-note-${index}`}>
              <Field name={`explaination-note[${index}]`} type="text" fullWidth
                component={renderTextField} label={f('explaination-note-num', {num: (index + 1)})} multiLine />
            </div>
            <div key={`explaination-category-${index}`}>
              <Field name={`explaination-category[${index}]`} fullWidth selectedMenuItemStyle={SELECTED_MENU_STYLE}
                component={renderSelectField} label={f('explaination-category-num', {num: (index + 1)})} multiple>
                {this.renderExplainationCategoryMenuItems()}
              </Field>
            </div>
          </div>
        ));
        return explainationLangRows;
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
