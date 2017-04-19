import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';

import AddFolderEntryForm from './../../components/AddFolderEntryForm/AddFolderEntryForm';
import {loadFolder} from './../../redux/modules/folder';
import {addFolderEntry} from './../../redux/modules/folderEntry';
import {setSnackBarParams} from './../../redux/modules/main';
import injectF from './../../helpers/injectF';
import resolve from './../../helpers/resolve';
import injectPush from './../../helpers/injectPush';

const styles = require('./PageAddFolderEntry.scss');

@connect(({folder}) => ({
  folder: folder.get('folder'),
}), {setSnackBarParams, addFolderEntry})
@injectF
@injectPush
@resolve(({dispatch, getState}, {params}) => {
  return dispatch(loadFolder({id: params.id}));
})
export default class PageAddFolderEntry extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    addFolderEntry: PropTypes.func.isRequired,
    setSnackBarParams: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  };

  handleSubmit = async (data) => {

    const {f, folder, addFolderEntry, setSnackBarParams, push} = this.props;
    const folderEntry = await addFolderEntry({folderId: folder.id, data});

    setSnackBarParams(true, f('folder-entry-has-been-created', {sourceEntry: folderEntry.sourceEntry}));
    push(`/folders/${folder.id}/entries`);
  };

  goBack = () => {
    const {folder, push} = this.props;
    push(`/folders/${folder.id}/entries`);
  };

  goToFoldersPage = () => this.props.push('/');

  render() {

    const {f, folder} = this.props;

    return (
      <div className={c('page-add', styles.pageAddFolderEntry)}>
        <div className="topbar">
          <ul className="breadcrumb">
            <li>
              <FlatButton label={f('folders')} onTouchTap={this.goToFoldersPage} />
            </li>
            <li>
              <FlatButton label={f('folder-entries', {folderName: folder.name})} onTouchTap={this.goBack} />
            </li>
            <li>
              <span>{f('add-entry')}</span>
            </li>
          </ul>
          <FlatButton icon={<i className="fa fa-arrow-left" />}
            label={f('back')} primary onTouchTap={this.goBack} />
        </div>
        <AddFolderEntryForm onSubmit={this.handleSubmit} folder={folder} initialValues={{folderId: folder.id}} />
      </div>
    );
  }
}
