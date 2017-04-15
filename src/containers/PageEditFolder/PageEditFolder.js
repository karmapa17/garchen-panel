import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';

import EditFolderForm from './../../components/EditFolderForm/EditFolderForm';
import DeleteFolderForm from './../../components/DeleteFolderForm/DeleteFolderForm';
import {loadFolder, updateFolder, deleteFolder} from './../../redux/modules/folder';
import {setSnackBarParams} from './../../redux/modules/main';
import injectF from './../../helpers/injectF';
import resolve from './../../helpers/resolve';
import injectPush from './../../helpers/injectPush';

const styles = require('./PageEditFolder.scss');

@connect(({folder}) => ({
  folder: folder.get('folder'),
}), {loadFolder, updateFolder, setSnackBarParams, deleteFolder})
@injectF
@injectPush
@resolve(({dispatch, getState}, {params}) => {
  return dispatch(loadFolder({id: params.id}));
})
export default class PageEditFolder extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    loadFolder: PropTypes.func.isRequired,
    deleteFolder: PropTypes.func.isRequired,
    setSnackBarParams: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    updateFolder: PropTypes.func.isRequired
  };

  handleEditFolderFormSubmit = async (data) => {
    const {f, params, updateFolder, push, setSnackBarParams} = this.props;
    data.id = params.id;
    const folder = await updateFolder(data);
    setSnackBarParams(true, f('folder-has-been-updated', {folderName: folder.name}));
    push('/');
  };

  handleDeleteFolderFormSubmit = async () => {
    const {f, deleteFolder, folder, push, setSnackBarParams} = this.props;
    await deleteFolder({id: folder.id});
    setSnackBarParams(true, f('folder-has-been-deleted', {folderName: folder.name}));
    push('/');
  };

  goToFoldersPage = () => this.props.push('/');

  render() {

    const {f, folder} = this.props;

    return (
      <div className={c('page-edit', styles.pageEditFolder)}>
        <div className="topbar">
          <ul className="breadcrumb">
            <li>
              <FlatButton label={f('folders')} onTouchTap={this.goToFoldersPage} />
            </li>
            <li>
              <span>{f('edit-folder')}</span>
            </li>
          </ul>
          <FlatButton icon={<i className="fa fa-arrow-left" />}
            label={f('back')} onTouchTap={this.goToFoldersPage} />
        </div>
        <EditFolderForm onSubmit={this.handleEditFolderFormSubmit} />
        <DeleteFolderForm className={styles.deleteFolderForm} onSubmit={this.handleDeleteFolderFormSubmit} folder={folder} />
      </div>
    );
  }
}
