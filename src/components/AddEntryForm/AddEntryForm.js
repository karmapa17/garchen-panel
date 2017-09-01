import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import injectMuiReduxFormHelper from './../../utils/injectMuiReduxFormHelper';
import injectF from './../../utils/injectF';
import asyncValidate from './addEntryFormAsyncValidate';

// helpers that are shared between AddEntryForm and EditEntryForm
import getExplanationLangs from './getExplanationLangs';
import getExplanationLangValues from './getExplanationLangValues';
import getNextExplanationIndex from './getNextExplanationIndex';
import renderContentFields from './renderContentFields';

const styles = require('./AddEntryForm.scss');

@reduxForm({
  form: 'addEntryForm',
  asyncValidate
})
@injectF
@injectMuiReduxFormHelper
export default class AddEntryForm extends Component {

  static propTypes = {
    folder: PropTypes.object.isRequired,
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
    this.state = {
      explanationIndex: 1,
      explanationLangs: getExplanationLangs(props.folder.data.contentFields)
    };
  }

  handleExplanationChange = (lang, index) => {
    return (event) => {
      const {explanationLangs, explanationIndex} = this.state;
      const langValues = getExplanationLangValues({
        currentValue: event.target.value,
        currentLang: lang,
        currentIndex: index,
        explanationLangs: this.state.explanationLangs,
        formName: 'addEntryForm',
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
    const {contentFields} = folder.data;
    return renderContentFields({f, contentFields, renderTextField,
      renderSelectField, explanationIndex, explanationLangs, handleExplanationChange: this.handleExplanationChange});
  }

  render() {

    const {handleSubmit, f, invalid, renderTextField, folder} = this.props;
    const {sourceLanguage} = folder.data;

    return (
      <form className={styles.addFolderEntryForm} onSubmit={handleSubmit}>

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
