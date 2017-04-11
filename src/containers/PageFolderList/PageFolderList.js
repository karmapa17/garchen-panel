import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {setAddFolderDialogOpen} from './../../redux/modules/main';
import {loadFolders} from './../../redux/modules/folder';
import AddFolderForm from './../../components/AddFolderForm/AddFolderForm';

const styles = require('./PageFolderList.scss');

@connect(({main, folder}) => ({
  folders: folder.get('folders'),
  isAddFolderDialogOpen: main.get('isAddFolderDialogOpen')
}), {loadFolders, setAddFolderDialogOpen})
export default class PageFolderList extends Component {

  static propTypes = {
    folders: PropTypes.array.isRequired,
    loadFolders: PropTypes.func.isRequired,
    isAddFolderDialogOpen: PropTypes.bool.isRequired,
    setAddFolderDialogOpen: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.loadFolders();
  }

  openAddFolderDialog = () => this.props.setAddFolderDialogOpen(true);

  handleAddFolderDialogClose = () => this.props.setAddFolderDialogOpen(false);

  renderAddFolderDialog() {

    const {isAddFolderDialogOpen} = this.props;

    const actions = [
      <FlatButton label="Cancel" onTouchTap={this.handleAddFolderDialogClose} />,
      <FlatButton label="Submit" primary onTouchTap={this.handleAddFolderDialogClose} />,
    ];
    return (
      <Dialog title="Add a folder" actions={actions} modal={false} open={isAddFolderDialogOpen}>
        here
      </Dialog>
    );
  }

  render() {

    return (
      <div className={c('page', 'page-list', styles.pageFolderList)}>
        <div className="topbar">
          <h2>Folders</h2>
          <FlatButton className="btn-add" icon={<i className="fa fa-plus" />}
            label="Add Folder" primary onTouchTap={this.openAddFolderDialog} />
        </div>
        {this.renderAddFolderDialog()}
      </div>
    );
  }
}
