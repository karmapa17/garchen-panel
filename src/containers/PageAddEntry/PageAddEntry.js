import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';

import AddEntryForm from './../../components/AddEntryForm/AddEntryForm';
import TopBar from './../../components/TopBar/TopBar';
import Breadcrumb from './../../components/Breadcrumb/Breadcrumb';
import {getFolder} from './../../redux/modules/folder';
import {addFolderEntry} from './../../redux/modules/entry';
import {setSnackBarParams} from './../../redux/modules/ui';
import injectF from './../../helpers/injectF';
import resolve from './../../helpers/resolve';
import injectPush from './../../helpers/injectPush';

const styles = require('./PageAddEntry.scss');

@connect(({folder}) => ({
  folder: folder.get('folder'),
}), {setSnackBarParams, addFolderEntry})
@injectF
@injectPush
@resolve(({dispatch, getState}, {params}) => {
  return dispatch(getFolder({id: params.id}));
})
export default class PageAddEntry extends Component {

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
      <div className={styles.pageAddFolderEntry}>
        <TopBar>
          <Breadcrumb>
            <Link to="/">{f('folders')}</Link>
            <Link to={`/folders/${folder.id}/entries`}>{f('folder-entries', {folderName: folder.name})}</Link>
            <span>{f('add-entry')}</span>
          </Breadcrumb>
          <FlatButton icon={<i className="fa fa-arrow-left" />}
            label={f('back')} primary onTouchTap={this.goBack} />
        </TopBar>
        <div className={styles.content}>
          <AddEntryForm onSubmit={this.handleSubmit} folder={folder} initialValues={{folderId: folder.id}} />
        </div>
      </div>
    );
  }
}
