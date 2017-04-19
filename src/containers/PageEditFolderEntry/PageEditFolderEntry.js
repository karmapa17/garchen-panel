import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';

import {getFolder} from './../../redux/modules/folder';
import {getEntry, updateEntry} from './../../redux/modules/entry';
import {setSnackBarParams} from './../../redux/modules/main';
import injectF from './../../helpers/injectF';
import resolve from './../../helpers/resolve';
import injectPush from './../../helpers/injectPush';
import TopBar from './../../components/TopBar/TopBar';
import Breadcrumb from './../../components/Breadcrumb/Breadcrumb';
import EditEntryForm from './../../components/EditEntryForm/EditEntryForm';

const styles = require('./PageEditFolderEntry.scss');

@connect(({folder, entry}) => ({
  folder: folder.get('folder'),
  entry: entry.get('entry')
}), {setSnackBarParams, updateEntry})
@injectF
@injectPush
@resolve(({dispatch, getState}, {params}) => {
  const promises = [];
  promises.push(dispatch(getFolder({id: params.folderId})));
  promises.push(dispatch(getEntry({id: params.entryId})));
  return Promise.all(promises);
})
export default class PageEditFolderEntry extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    updateEntry: PropTypes.func.isRequired,
    setSnackBarParams: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  };

  goBack = () => {
    const {folder, push} = this.props;
    push(`/folders/${folder.id}/entries`);
  };

  goToFoldersPage = () => this.props.push('/');

  handleSubmit = async (data) => {
    const {entry, updateEntry, setSnackBarParams, f} = this.props;
    await updateEntry({
      id: entry.id,
      data
    });
    this.goBack();
    setSnackBarParams(true, f('folder-entry-has-been-updated', {sourceEntry: data.sourceEntry}));
  };

  render() {

    const {f, folder, entry} = this.props;
    const initialValues = {
      entryId: entry.id,
      folderId: folder.id,
      sourceEntry: entry.sourceEntry,
      ...entry.data
    };

    return (
      <div className={styles.pageFolderEntry}>
        <TopBar>
          <Breadcrumb>
            <FlatButton label={f('folders')} onTouchTap={this.goToFoldersPage} />
            <FlatButton label={f('folder-entries', {folderName: folder.name})} onTouchTap={this.goBack} />
            <span>{f('edit-folder-entry', {sourceEntry: entry.sourceEntry})}</span>
          </Breadcrumb>
          <FlatButton icon={<i className="fa fa-arrow-left" />}
            label={f('back')} primary onTouchTap={this.goBack} />
        </TopBar>
        <EditEntryForm onSubmit={this.handleSubmit} folder={folder} initialValues={initialValues} />
      </div>
    );
  }
}
