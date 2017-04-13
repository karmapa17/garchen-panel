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
import {addFolder, loadFolders, setPageParams} from './../../redux/modules/folder';
import AddFolderForm from './../../components/AddFolderForm/AddFolderForm';
import Pagination from './../../components/Pagination/Pagination';

const styles = require('./PageFolders.scss');

const dialogStyle = {
  maxHeight: '100%'
};

@connect(({main, folder}) => ({
  page: folder.get('page'),
  perpage: folder.get('perpage'),
  folders: folder.get('folders'),
  folderCount: folder.get('folderCount'),
  isAddFolderDialogOpen: main.get('isAddFolderDialogOpen')
}), {loadFolders, setAddFolderDialogOpen, addFolder, setPageParams})
export default class PageFolders extends Component {

  static propTypes = {
    page: PropTypes.number.isRequired,
    perpage: PropTypes.number.isRequired,
    setPageParams: PropTypes.func.isRequired,
    query: PropTypes.object,
    addFolder: PropTypes.func.isRequired,
    folders: PropTypes.array.isRequired,
    folderCount: PropTypes.number.isRequired,
    loadFolders: PropTypes.func.isRequired,
    isAddFolderDialogOpen: PropTypes.bool.isRequired,
    setAddFolderDialogOpen: PropTypes.func.isRequired
  };

  componentWillMount() {
    const {page, perpage} = this.props;
    this.props.loadFolders({page, perpage});
  }

  componentWillReceiveProps(nextProps) {
    const {page, perpage, loadFolders} = this.props;
    if ((page !== nextProps.page) || (perpage !== nextProps.perpage)) {
      loadFolders({
        page: nextProps.page,
        perpage: nextProps.perpage
      });
    }
  }

  openAddFolderDialog = () => this.props.setAddFolderDialogOpen(true);

  handleAddFolderDialogClose = () => this.props.setAddFolderDialogOpen(false);

  handleSubmitButtonTouchTap = () => {
    this.refs.addFolderForm.submit();
  };

  handleSubmit = (data) => {
    const {addFolder, setAddFolderDialogOpen, loadFolders, page, perpage} = this.props;

    addFolder(data)
      .then(() => loadFolders({page, perpage}))
      .then(() => setAddFolderDialogOpen(false));
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

  handlePageButtonTouchTap = (page) => this.props.setPageParams(page);

  render() {

    const {page, perpage, folderCount} = this.props;

    return (
      <div className={c('page-list', styles.pageFolders)}>
        <div className="topbar">
          <h2>Folders</h2>
          <FlatButton className="btn-add" icon={<i className="fa fa-plus" />}
            label="Add Folder" primary onTouchTap={this.openAddFolderDialog} />
        </div>
        {this.renderFolders()}
        <Pagination pathname="/" current={page} total={Math.ceil(folderCount / perpage)} onButtonTouchTap={this.handlePageButtonTouchTap} />
        {this.renderAddFolderDialog()}
      </div>
    );
  }
}
