import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

import {setAddFolderDialogOpen} from './../../redux/modules/main';
import {addFolder, loadFolders} from './../../redux/modules/folder';
import AddFolderForm from './../../components/AddFolderForm/AddFolderForm';

const styles = require('./PageFolderList.scss');

const dialogStyle = {
  maxHeight: '100%'
};

@connect(({main, folder}) => ({
  folders: folder.get('folders'),
  isAddFolderDialogOpen: main.get('isAddFolderDialogOpen')
}), {loadFolders, setAddFolderDialogOpen, addFolder})
export default class PageFolderList extends Component {

  static propTypes = {
    addFolder: PropTypes.func.isRequired,
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

  handleSubmitButtonTouchTap = () => {
    this.refs.addFolderForm.submit();
  };

  handleSubmit = (data) => {
    this.props.addFolder(data);
    this.props.setAddFolderDialogOpen(false);
  };

  renderAddFolderDialog() {

    const {isAddFolderDialogOpen} = this.props;

    const actions = [
      <FlatButton label="Cancel" onTouchTap={this.handleAddFolderDialogClose} />,
      <FlatButton label="Submit" primary onTouchTap={this.handleSubmitButtonTouchTap} />,
    ];
    return (
      <Dialog title="Add a folder" actions={actions} open={isAddFolderDialogOpen}
        contentStyle={dialogStyle}
        onRequestClose={this.handleAddFolderDialogClose}>
        <AddFolderForm ref="addFolderForm" onSubmit={this.handleSubmit} />
      </Dialog>
    );
  }

  renderFolders() {
    const {folders} = this.props;
    return folders.map((folder) => {
      const {id, name} = folder;
      return (
        <Paper className={styles.folder} key={`paper-${id}`}>
          <a className={styles.folderName}>{name}</a>
          <IconMenu className={styles.folderIconMenu} style={{display: 'block', position: 'absolute'}}
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            onChange={this.handleEditMenuItemTouchTap}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}>
            <MenuItem primaryText="Edit" value={{type: 'edit', id}} />
            <MenuItem primaryText="Delete" value={{type: 'delete', id}} />
          </IconMenu>
        </Paper>
      );
    });
  }

  render() {

    return (
      <div className={c('page-list', styles.pageFolderList)}>
        <div className="topbar">
          <h2>Folders</h2>
          <FlatButton className="btn-add" icon={<i className="fa fa-plus" />}
            label="Add Folder" primary onTouchTap={this.openAddFolderDialog} />
        </div>
        {this.renderFolders()}
        {this.renderAddFolderDialog()}
      </div>
    );
  }
}
