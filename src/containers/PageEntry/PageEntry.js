import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';
import {isArray} from 'lodash';
import ChevronRightIcon from 'material-ui/svg-icons/navigation/chevron-right';
import ChevronLeftIcon from 'material-ui/svg-icons/navigation/chevron-left';

import {getFolder} from './../../redux/modules/folder';
import {getEntry, updateEntry} from './../../redux/modules/entry';
import {setSnackBarParams} from './../../redux/modules/ui';
import injectF from './../../helpers/injectF';
import resolve from './../../helpers/resolve';
import injectPush from './../../helpers/injectPush';
import TopBar from './../../components/TopBar/TopBar';
import Breadcrumb from './../../components/Breadcrumb/Breadcrumb';
import EditEntryForm from './../../components/EditEntryForm/EditEntryForm';
import filterLastContinuousUndefinedValues from './../../helpers/filterLastContinuousUndefinedValues';
import renderContentFields from './renderContentFields';
import hasValue from './../../helpers/hasValue';

const styles = require('./PageEntry.scss');

@connect(({folder, entry}) => ({
  folder: folder.get('folder'),
  entry: entry.get('entry'),
  nextEntryId: entry.get('nextEntryId'),
  prevEntryId: entry.get('prevEntryId'),
  importingFolderId: folder.get('importingFolderId')
}), {setSnackBarParams, updateEntry, getEntry})
@injectF
@injectPush
@resolve(({dispatch, getState}, {params}) => {
  const promises = [];
  promises.push(dispatch(getFolder({id: params.folderId})));
  promises.push(dispatch(getEntry({id: params.entryId})));
  return Promise.all(promises);
})
export default class PageEntry extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired,
    nextEntryId: PropTypes.number,
    prevEntryId: PropTypes.number,
    params: PropTypes.object.isRequired,
    setSnackBarParams: PropTypes.func.isRequired,
    getEntry: PropTypes.func.isRequired,
    updateEntry: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    importingFolderId: PropTypes.number
  };

  componentWillReceiveProps(nextProps) {

    const {params, getEntry} = this.props;
    const {entryId} = params;
    const nextEntryId = nextProps.params.entryId;

    if (entryId !== nextEntryId) {
      getEntry({id: nextEntryId});
    }
  }

  constructor(props) {
    super(props);
    this.state = {isEditMode: false};
  }

  goBack = () => {
    const {folder, push} = this.props;
    push(`/folders/${folder.id}/entries`);
  };

  goToFoldersPage = () => this.props.push('/');

  renderContentFields() {
    const {entry: {data}, f, folder} = this.props;
    const {targetLanguages, contentFields} = folder.data;
    return renderContentFields({f, data, contentFields, targetLanguages});
  }

  handleSubmit = async (rawData) => {

    const {entry, updateEntry, setSnackBarParams, f} = this.props;

    const data = Object.keys(rawData).reduce((obj, prop) => {
      const value = rawData[prop];
      obj[prop] = isArray(value) ? filterLastContinuousUndefinedValues(value) : value;
      return obj;
    }, {});

    await updateEntry({
      id: entry.id,
      data
    });
    setSnackBarParams(true, f('folder-entry-has-been-updated', {sourceEntry: data.sourceEntry}));
    this.setState({isEditMode: false});
  };

  isImporting = () => {
    const {folder, importingFolderId} = this.props;
    return folder.id === importingFolderId;
  };

  setEditMode = () => this.setState({isEditMode: true});

  renderContent() {

    const {isEditMode} = this.state;
    const {f, folder, entry} = this.props;

    const initialValues = {
      entryId: entry.id,
      folderId: folder.id,
      sourceEntry: entry.sourceEntry,
      ...entry.data
    };

    if (isEditMode) {
      return <EditEntryForm ref="editEntryForm" onSubmit={this.handleSubmit} folder={folder} initialValues={initialValues} />;
    }

    return (
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>{f('source-entry-lang', {lang: f(folder.data.sourceLanguage)})}</th>
            <td>{entry.sourceEntry}</td>
          </tr>
          {this.renderContentFields()}
        </tbody>
      </table>
    );
  }

  cancelEdit = () => this.setState({isEditMode: false});

  handlePrevButtonTouchTap = () => {
    const {push, prevEntryId, folder} = this.props;
    push(`folders/${folder.id}/entries/${prevEntryId}`);
  };

  handleNextButtonTouchTap = () => {
    const {push, nextEntryId, folder} = this.props;
    push(`folders/${folder.id}/entries/${nextEntryId}`);
  };

  renderPrevButton() {

    const {isEditMode} = this.state;
    const {prevEntryId} = this.props;

    if (hasValue(prevEntryId) && (! isEditMode)) {
      const iconStyle = {
        height: '54px',
        width: '54px'
      };
      const buttonStyle = {
        position: 'fixed',
        left: '14px',
        bottom: 0,
        top: 0,
        height: '300px',
        marginTop: 'auto',
        marginBottom: 'auto'
      };
      return <FlatButton icon={<ChevronLeftIcon style={iconStyle} />} style={buttonStyle} onTouchTap={this.handlePrevButtonTouchTap} disableTouchRipple />;
    }
  }

  renderNextButton() {

    const {isEditMode} = this.state;
    const {nextEntryId} = this.props;

    if (hasValue(nextEntryId) && (! isEditMode)) {
      const iconStyle = {
        height: '54px',
        width: '54px'
      };
      const buttonStyle = {
        position: 'fixed',
        right: '14px',
        bottom: 0,
        top: 0,
        height: '300px',
        marginTop: 'auto',
        marginBottom: 'auto'
      };
      return <FlatButton icon={<ChevronRightIcon style={iconStyle} />} style={buttonStyle} onTouchTap={this.handleNextButtonTouchTap} disableTouchRipple />;
    }
  }

  render() {

    const {isEditMode} = this.state;
    const {f, folder, entry} = this.props;

    return (
      <div className={c('page-info', styles.pageFolderEntry)}>
        {this.renderPrevButton()}
        {this.renderNextButton()}
        <TopBar>
          <Breadcrumb>
            <Link to="/">{f('folders')}</Link>
            <Link to={`/folders/${folder.id}/entries`}>{f('folder-entries', {folderName: folder.name})}</Link>
            <span>{entry.sourceEntry}</span>
          </Breadcrumb>
          <div>

           {isEditMode && <FlatButton icon={<i className="fa fa-ban" />}
              label={f('cancel')} primary onTouchTap={this.cancelEdit} />}

           {(! isEditMode) && <FlatButton icon={<i className="fa fa-pencil" />}
              label={f('edit')} primary disabled={this.isImporting()} onTouchTap={this.setEditMode} />}

            <FlatButton icon={<i className="fa fa-arrow-left" />}
              label={f('back')} primary onTouchTap={this.goBack} />
          </div>
        </TopBar>
        <div className={styles.content}>{this.renderContent()}</div>
      </div>
    );
  }
}
