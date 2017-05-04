import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import DICTIONARY_LANGS from './../../constants/dictionaryLangs';
import injectF from './../../helpers/injectF';
import ipc from './../../helpers/ipc';
import injectPush from './../../helpers/injectPush';
import {addFolderByCsv} from './../../redux/modules/folder';
import ExternalLink from './../ExternalLink/ExternalLink';

const styles = require('./PageImportCsv.scss');
const dictionaryLangs = DICTIONARY_LANGS.map((row) => row.value);
const langExpression = '{lang}';
const supportedColumns = [
  {textId: 'source-entry', expression: 'source-entry-{lang}'},
  {textId: 'explaination', expression: 'explaination-{lang}'},
  {textId: 'explaination-note', expression: 'explaination-note-{lang}'},
  {textId: 'page-num', expression: 'page-num'},
];

const csvExampleUrl = 'https://goo.gl/YcRMrT';

@connect(({folder, main}) => ({
  isProcessingCsv: folder.get('isProcessingCsv'),
  errorMessage: folder.get('errorCsvMessage'),
  errorMessageId: folder.get('errorCsvMessageId'),
  errorFilename: folder.get('errorCsvFilename'),
  writeDelay: main.get('writeDelay')
}), {addFolderByCsv})
@injectIntl
@injectPush
@injectF
export default class PageImportCsv extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    fh: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    isProcessingCsv: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string,
    errorMessageId: PropTypes.string,
    errorFilename: PropTypes.string,
    writeDelay: PropTypes.number.isRequired,
    addFolderByCsv: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      completedLines: 0
    };
  }

  handleCsvProcessingStatus = (event, data) => {
    this.setState({completedLines: data.completedLines});
  };

  componentWillMount() {
    ipc.on('csv-processing-status', this.handleCsvProcessingStatus);
  }

  componentWillUnmount() {
    ipc.off('csv-processing-status', this.handleCsvProcessingStatus);
  }

  handleChooseCsvFileButtonTouchTap = () => {
    const {addFolderByCsv, writeDelay} = this.props;
    addFolderByCsv(writeDelay);
  }

  renderChooseCsvFileButton = () => {

    const {completedLines} = this.state;
    const {f, isProcessingCsv} = this.props;

    if (isProcessingCsv) {
      return (
        <div className={styles.chooseFileBtnWrap}>
          {(completedLines > 0) && <div className={styles.linesCompleted}>{f('completed-csv-line', {completedLines: `${completedLines}`})}</div>}
          <CircularProgress />
        </div>
      );
    }
    return (
      <div className={styles.chooseFileBtnWrap}>
        <RaisedButton label={f('choose-csv-file')} primary onTouchTap={this.handleChooseCsvFileButtonTouchTap} />
      </div>
    );
  };

  render() {

    const {f, fh, errorMessage, errorMessageId, errorFilename} = this.props;
    const supportedLangs = dictionaryLangs.map((lang) => `${f(lang)} ${lang}`)
      .join(', ');

    const supportedColumnNames = supportedColumns.map(({textId, expression}) => `${f(textId)} ${expression}`)
      .join(', ');

    const externalLinkButton = <ExternalLink href={csvExampleUrl}>{csvExampleUrl}</ExternalLink>;

    return (
      <div className={styles.pageImportCsv}>
        <div className={styles.content}>
          <h2>{f('import-csv-file')}</h2>
          <ul>
            <li>{fh('import-csv-rule-1', {supportedLangs, langExpression})}</li>
            <li>{fh('import-csv-rule-2', {langExpression})}</li>
            <li>{fh('import-csv-rule-3', {supportedColumnNames})}</li>
            <li>{fh('import-csv-rule-4')} {externalLinkButton}</li>
            <li>{fh('import-csv-rule-5')}</li>
          </ul>
          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
          {errorMessageId && errorFilename && <div className={styles.errorMessage}>{f(errorMessageId, {errorFilename})}</div>}
          {this.renderChooseCsvFileButton()}
        </div>
      </div>
    );
  }
}
