import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';

import {getFolder} from './../../redux/modules/folder';
import {getEntry, updateEntry} from './../../redux/modules/entry';
import {setSnackBarParams, setEditFolderEntryStatus} from './../../redux/modules/ui';
import injectF from './../../helpers/injectF';
import resolve from './../../helpers/resolve';
import injectPush from './../../helpers/injectPush';
import sortEntryKeys from './../../helpers/sortEntryKeys';
import entryKeysToDataRows from './../../helpers/entryKeysToDataRows';
import TopBar from './../../components/TopBar/TopBar';
import Breadcrumb from './../../components/Breadcrumb/Breadcrumb';
import EditEntryForm from './../../components/EditEntryForm/EditEntryForm';

const styles = require('./PageFolderEntry.scss');

@connect(({folder, entry, ui}) => ({
  folder: folder.get('folder'),
  entry: entry.get('entry'),
  isEditingFolderEntry: ui.get('isEditingFolderEntry')
}), {setSnackBarParams, setEditFolderEntryStatus, updateEntry})
@injectF
@injectPush
@resolve(({dispatch, getState}, {params}) => {
  const promises = [];
  promises.push(dispatch(getFolder({id: params.folderId})));
  promises.push(dispatch(getEntry({id: params.entryId})));
  return Promise.all(promises);
})
export default class PageFolderEntry extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    setSnackBarParams: PropTypes.func.isRequired,
    updateEntry: PropTypes.func.isRequired,
    setEditFolderEntryStatus: PropTypes.func.isRequired,
    isEditingFolderEntry: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired
  };

  goBack = () => {
    const {folder, push} = this.props;
    push(`/folders/${folder.id}/entries`);
  };

  goToFoldersPage = () => this.props.push('/');

  renderContentFields() {

    const {entry, f} = this.props;
    const keys = sortEntryKeys(Object.keys(entry.data));
    const rows = entryKeysToDataRows(keys, entry.data, f);

    return rows.map(({key, value, lang}) => {

      if (lang) {
        return (
          <tr key={`${key}-${lang}`}>
            <th>{f(`${key}-lang`, {lang: f(lang)})}</th>
            <td>{value}</td>
          </tr>
        );
      }

      return (
        <tr key={key}>
          <th>{f(key)}</th>
          <td>{value}</td>
        </tr>
      );
    });
  }

  goToEditPage = () => {
    const {push, folder, entry} = this.props;
    push(`/folders/${folder.id}/entries/${entry.id}/edit`);
  };

  handleSubmit = async (data) => {
    const {entry, updateEntry, setSnackBarParams, f, setEditFolderEntryStatus} = this.props;
    await updateEntry({
      id: entry.id,
      data
    });
    setSnackBarParams(true, f('folder-entry-has-been-updated', {sourceEntry: data.sourceEntry}));
    setEditFolderEntryStatus(false);
  };

  setEditMode = () => this.props.setEditFolderEntryStatus(true);

  renderContent() {

    const {f, folder, entry, isEditingFolderEntry} = this.props;

    const initialValues = {
      entryId: entry.id,
      folderId: folder.id,
      sourceEntry: entry.sourceEntry,
      ...entry.data
    };

    if (isEditingFolderEntry) {
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

  cancelEdit = () => this.props.setEditFolderEntryStatus(false);

  componentWillUnmount() {
    this.props.setEditFolderEntryStatus(false);
  }

  render() {

    const {f, folder, entry, isEditingFolderEntry} = this.props;

    return (
      <div className={c('page-info', styles.pageFolderEntry)}>
        <TopBar>
          <Breadcrumb>
            <Link to="/">{f('folders')}</Link>
            <Link to={`/folders/${folder.id}/entries`}>{f('folder-entries', {folderName: folder.name})}</Link>
            <span>{entry.sourceEntry}</span>
          </Breadcrumb>
          <div>

           {(isEditingFolderEntry) && <FlatButton icon={<i className="fa fa-ban" />}
              label={f('cancel')} primary onTouchTap={this.cancelEdit} />}

           {(! isEditingFolderEntry) && <FlatButton icon={<i className="fa fa-pencil" />}
              label={f('edit')} primary onTouchTap={this.setEditMode} />}

            <FlatButton icon={<i className="fa fa-arrow-left" />}
              label={f('back')} primary onTouchTap={this.goBack} />
          </div>
        </TopBar>
        <div className={styles.content}>{this.renderContent()}</div>
      </div>
    );
  }
}
