import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import RaisedButton from 'material-ui/RaisedButton';

import injectF from './../../helpers/injectF';
import ipc from './../../helpers/ipc';
import {setProcessingCsvStatus} from './../../redux/modules/ui';
import injectPush from './../../helpers/injectPush';

const styles = require('./PageImportCsv.scss');

@connect(({}) => ({}), {setProcessingCsvStatus})
@injectIntl
@injectPush
@injectF
export default class PageImportCsv extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    setProcessingCsvStatus: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      completedLines: 0,
      errorMessage: '',
      done: false
    };
  }

  handleCsvProcessingStatus = (event, data) => {
    const {completedLines} = data;
    this.setState({completedLines});
  };

  handleCsvProcessingEnd = () => {
    this.setState({done: true});
  };

  handleCsvProcessingError = (event, data) => {
    this.setState({errorMessage: data.message});
  };

  componentWillMount() {
    ipc.on('csv-processing-status', this.handleCsvProcessingStatus);
    ipc.on('csv-processing-error', this.handleCsvProcessingError);
    ipc.on('csv-processing-end', this.handleCsvProcessingEnd);
  }

  componentWillUnmount() {
    ipc.off('csv-processing-status', this.handleCsvProcessingStatus);
    ipc.off('csv-processing-error', this.handleCsvProcessingError);
    ipc.off('csv-processing-end', this.handleCsvProcessingEnd);
  }

  handleDoneButtonTouchTape = () => {
    const {setProcessingCsvStatus} = this.props;
    setProcessingCsvStatus(false);
  };

  handleConfirmButtonTouchTape = () => {
    this.props.setProcessingCsvStatus(false);
  };

  render() {
    const {completedLines, done, errorMessage} = this.state;
    const {f} = this.props;
    return (
      <div className={styles.pageImportCsv}>
        <h1>{f('import-csv-file')}</h1>
        <h2>{f('completed-csv-line', {completedLines: `${completedLines}`})}</h2>
        {errorMessage && <p>Error: {errorMessage}</p>}
        {errorMessage && <RaisedButton label={f('confirm')} onTouchTap={this.handleConfirmButtonTouchTape} />}
        {done && <RaisedButton label={f('see-imported-folder')} onTouchTap={this.handleDoneButtonTouchTape} />}
      </div>
    );
  }
}
