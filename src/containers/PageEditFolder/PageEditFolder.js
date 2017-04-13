import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';

import EditFolderForm from './../../components/EditFolderForm/EditFolderForm';
import {loadFolder, updateFolder} from './../../redux/modules/folder';
import {setSnackBarParams} from './../../redux/modules/main';
import injectF from './../../helpers/injectF';
import resolve from './../../helpers/resolve';
import injectPush from './../../helpers/injectPush';

const styles = require('./PageEditFolder.scss');

@connect(({folder}) => ({
  folder: folder.get('folder'),
}), {loadFolder, updateFolder, setSnackBarParams})
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
    setSnackBarParams: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    updateFolder: PropTypes.func.isRequired
  };

  handleSubmit = async (data) => {
    const {f, params, updateFolder, push, setSnackBarParams} = this.props;
    data.id = params.id;
    const folder = await updateFolder(data);
    setSnackBarParams(true, f('folder-has-been-updated', {folderName: folder.name}));
    push('/');
  };

  goToFoldersPage = () => this.props.push('/');

  render() {

    const {f} = this.props;

    return (
      <div className={c('page-edit', styles.pageEditFolder)}>
        <div className="topbar">
          <h2>{f('edit-folder')}</h2>
          <FlatButton icon={<i className="fa fa-arrow-left" />}
            label={f('back')} primary onTouchTap={this.goToFoldersPage} />
        </div>
        <EditFolderForm onSubmit={this.handleSubmit} />
      </div>
    );
  }
}
