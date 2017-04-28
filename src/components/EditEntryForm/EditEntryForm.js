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

  constructor(props) {
    super(props);
    this.state = this.genDefaultState(props.folder.data.contentFields);
    this.state = this.overrideStateByValues(props.initialValues, this.state);
  }

  getExplainationIndex = (lang) => `explaination-${lang}-index`;

  genDefaultState(contentFields) {

    return contentFields.reduce((state, field) => {

      const matchExplaination = field.match(/^explaination-lang-(.+)$/);

      if (matchExplaination) {
        const lang = matchExplaination[1];
        state[this.getExplainationIndex(lang)] = 1;
      }
      return state;
    }, {});
  }

  overrideStateByValues(contentFields, state) {

    return Object.keys(contentFields)
      .reduce((state, field) => {

        const matchExplaination = field.match(/^explaination-(.+)$/);

        if (matchExplaination) {
          const arr = contentFields[field];
          const lang = matchExplaination[1];
          state[this.getExplainationIndex(lang)] = arr.length;
        }
        return state;
      }, state);
  }

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

      const key = this.getExplainationIndex(lang);

      if (!! event.target.value) {
        this.setState({[key]: index + 2});
      }
    };
  };

  renderContentFields() {
    const {folder, f, renderTextField, renderSelectField} = this.props;
    const {contentFields} = folder.data;

    return contentFields.map((field) => {

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
            <Field name="category" component={renderSelectField} label={f('category')} fullWidth>
              {this.renderCategoryMenuItems()}
            </Field>
          </div>
        );
      }

      if ('sect' === field) {
        return (
          <div key="sect">
            <Field name="sect" component={renderSelectField} label={f('sect')} fullWidth>
              {this.renderSectMenuItems()}
            </Field>
          </div>
        );
      }

      const matchExplaination = field.match(/^explaination-lang-(.+)$/);

      if (matchExplaination) {

        const lang = matchExplaination[1];
        const explainationIndex = this.state[this.getExplainationIndex(lang)] || 0;

        const rows = range(0, explainationIndex)
          .reduce((rows, elem, index) => {
            rows.push((
              <div key={`explaination-${lang}-${index}`}>
                <Field name={`explaination-${lang}[${index}]`} type="text" fullWidth onChange={this.handleExplainationChange(lang, index)}
                  component={renderTextField} label={f('explaination-lang', {lang: f(lang), num: (index + 1)})} multiLine />
              </div>
            ));
            rows.push((
              <div key={`source-${lang}-${index}`}>
                <Field name={`source-${lang}[${index}]`} type="text" fullWidth
                  component={renderTextField} label={f('explaination-source-lang', {lang: f(lang), num: (index + 1)})} multiLine />
              </div>
            ));
            rows.push((
              <div key={`note-${lang}-${index}`}>
                <Field name={`note-${lang}[${index}]`} type="text" fullWidth
                  component={renderTextField} label={f('explaination-note-lang', {lang: f(lang), num: (index + 1)})} multiLine />
              </div>
            ));
            return rows;
          }, []);

        return rows;
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
