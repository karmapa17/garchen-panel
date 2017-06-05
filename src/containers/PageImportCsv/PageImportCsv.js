import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import DICTIONARY_LANGS from './../../main/constants/dictionaryLangs';
import injectF from './../../helpers/injectF';
import ipc from './../../helpers/ipc';
import injectPush from './../../helpers/injectPush';
import {addFolderByCsv, setImportingFolderId, cancelImportingCsv, setIsProcessingCsv,
  setIsOpeningDialog} from './../../redux/modules/folder';
import Heading from './../Heading/Heading';
import ExternalLink from './../ExternalLink/ExternalLink';
import getFontSize from './../../helpers/getFontSize';

const styles = require('./PageImportCsv.scss');
const dictionaryLangs = DICTIONARY_LANGS.map((row) => row.value);
const langExpression = '{lang}';
const supportedColumns = [
  {textId: 'source-entry', expression: 'source-entry-{lang}'},
  {textId: 'explanation', expression: 'explanation-{lang}'},
  {textId: 'explanation-note', expression: 'explanation-note'},
  {textId: 'page-num', expression: 'page-num'},
];

const csvExampleUrl = 'https://goo.gl/YcRMrT';

@connect(({folder, main}) => ({
  interfaceFontSizeScalingFactor: main.get('interfaceFontSizeScalingFactor'),
  contentFontSizeScalingFactor: main.get('contentFontSizeScalingFactor'),
  isProcessingCsv: folder.get('isProcessingCsv'),
  isOpeningDialog: folder.get('isOpeningDialog'),
  errorMessage: folder.get('errorCsvMessage'),
  errorMessageId: folder.get('errorCsvMessageId'),
  errorFilename: folder.get('errorCsvFilename'),
  writeDelay: main.get('writeDelay')
}), {addFolderByCsv, setImportingFolderId, cancelImportingCsv, setIsProcessingCsv, setIsOpeningDialog})
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
    setIsProcessingCsv: PropTypes.func.isRequired,
    interfaceFontSizeScalingFactor: PropTypes.number.isRequired,
    isOpeningDialog: PropTypes.bool.isRequired,
    contentFontSizeScalingFactor: PropTypes.number.isRequired,
    setImportingFolderId: PropTypes.func.isRequired,
    setIsOpeningDialog: PropTypes.func.isRequired,
    cancelImportingCsv: PropTypes.func.isRequired,
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

  handleCsvFolderCreated = (event, data) => {
    this.props.setImportingFolderId(data.folderId);
  };

  handleCsvProcessingStart = () => {
    const {setIsProcessingCsv, setIsOpeningDialog} = this.props;
    setIsProcessingCsv(true);
    setIsOpeningDialog(false);
  };

  componentWillMount() {
    ipc.on('csv-processing-start', this.handleCsvProcessingStart);
    ipc.on('csv-folder-created', this.handleCsvFolderCreated);
    ipc.on('csv-processing-status', this.handleCsvProcessingStatus);
  }

  componentWillUnmount() {
    ipc.off('csv-processing-start', this.handleCsvProcessingStart);
    ipc.off('csv-folder-created', this.handleCsvFolderCreated);
    ipc.off('csv-processing-status', this.handleCsvProcessingStatus);
  }

  handleChooseCsvFileButtonTouchTap = () => {
    const {addFolderByCsv, writeDelay} = this.props;
    addFolderByCsv(writeDelay);
  }

  handleCancelImportingCsvButtonTouchTap = () => this.props.cancelImportingCsv();

  renderChooseCsvFileButton = () => {

    const {completedLines} = this.state;
    const {f, isProcessingCsv, isOpeningDialog, interfaceFontSizeScalingFactor} = this.props;
    const buttonFontSize = getFontSize(interfaceFontSizeScalingFactor, 0.9);

    if (isProcessingCsv) {
      return (
        <div className={styles.chooseFileBtnWrap}>
          {(completedLines > 0) && <div className={styles.linesCompleted}>{f('completed-csv-line', {completedLines: `${completedLines}`})}</div>}
          <CircularProgress style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '14px'}} />
          <RaisedButton label={f('cancel-importing')} primary onTouchTap={this.handleCancelImportingCsvButtonTouchTap} />
        </div>
      );
    }
    return (
      <div className={styles.chooseFileBtnWrap}>
        <RaisedButton label={f('choose-csv-file')} labelStyle={{fontSize: buttonFontSize}}
          primary onTouchTap={this.handleChooseCsvFileButtonTouchTap} disabled={isOpeningDialog} />
      </div>
    );
  };

  render() {

    const {f, fh, errorMessage, errorMessageId, errorFilename, contentFontSizeScalingFactor} = this.props;
    const supportedLangs = dictionaryLangs.map((lang) => `${f(lang)} ${lang}`)
      .join(', ');

    const supportedColumnNames = supportedColumns.map(({textId, expression}) => `${f(textId)} ${expression}`)
      .join(', ');

    const externalLinkButton = <ExternalLink href={csvExampleUrl}>{csvExampleUrl}</ExternalLink>;
    const contentFontSize = getFontSize(contentFontSizeScalingFactor, 1);

    return (
      <div className={styles.pageImportCsv}>
        <div className={styles.content}>
          <Heading>{f('import-csv-file')}</Heading>
          <ul style={{fontSize: contentFontSize}}>
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
