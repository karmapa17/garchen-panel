import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import injectMuiReduxFormHelper from './../../utils/injectMuiReduxFormHelper';
import injectF from './../../utils/injectF';
import asyncValidate from './editEntryFormAsyncValidate';

// helpers that are shared between AddEntryForm and EditEntryForm
import getNextExplanationIndex from './../AddEntryForm/getNextExplanationIndex';
import getExplanationLangs from './../AddEntryForm/getExplanationLangs';
import getExplanationLangValues from './../AddEntryForm/getExplanationLangValues';
import renderContentFields from './../AddEntryForm/renderContentFields';

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
    }, 1);
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

  renderContentFields() {

    const {explanationIndex, explanationLangs} = this.state;
    const {folder, f, renderTextField, renderSelectField} = this.props;

    return renderContentFields({f, contentFields: folder.data.contentFields, renderTextField,
      renderSelectField, explanationIndex, explanationLangs, handleExplanationChange: this.handleExplanationChange});
  }

  render() {

    const {handleSubmit, f, invalid, folder, renderTextField} = this.props;
    const {sourceLanguage} = folder.data;

    return (
      <form className={styles.editEntryForm} onSubmit={handleSubmit}>
        <div className={styles.formBody}>
          <div>
            <Field name="sourceEntry" type="text" component={renderTextField} label={f('source-entry-lang', {lang: f(sourceLanguage)})} autoFocus fullWidth />
          </div>
          <div>{this.renderContentFields()}</div>
        </div>
        <RaisedButton className={styles.submitButton} type="submit" label={f('submit')} primary disabled={invalid} />
      </form>
    );
  }
}
