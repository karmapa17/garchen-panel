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

import {setAddFolderDialogOpen, setSnackBarParams} from './../../redux/modules/main';
import {addFolder, loadFolders, setPageParams} from './../../redux/modules/folder';
import AddFolderForm from './../../components/AddFolderForm/AddFolderForm';
import Pagination from './../../components/Pagination/Pagination';

import injectF from './../../helpers/injectF';
import injectPush from './../../helpers/injectPush';
import resolve from './../../helpers/resolve';

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
}), {loadFolders, setAddFolderDialogOpen, addFolder, setPageParams, setSnackBarParams})
@injectPush
@injectF
@resolve(({dispatch}, {page, perpage}) => {
  return dispatch(loadFolders({page, perpage}));
})
export default class PageFolders extends Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    f: PropTypes.func.isRequired,
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
    const {f, addFolder, setAddFolderDialogOpen, loadFolders, page, perpage} = this.props;

    addFolder(data)
      .then(() => loadFolders({page, perpage}))
      .then(() => {
        setSnackBarParams(true, f('folder-has-been-created'));
        setAddFolderDialogOpen(false);
      });
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
    const {f, folders} = this.props;
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
            <MenuItem primaryText={f('edit')} value={{type: 'edit', id}} onTouchTap={this.goToEditPage(id)} />
          </IconMenu>
        </Paper>
      );
    });
  }

  goToEditPage = (id) => {
    return () => this.props.push(`/folders/${id}/edit`);
  };

  handlePageButtonTouchTap = (page) => this.props.setPageParams(page);

  render() {

    const {f, page, perpage, folderCount} = this.props;

    return (
      <div className={c('page-list', styles.pageFolders)}>
        <div className="topbar">
          <h2>{f('folders')}</h2>
          <FlatButton className="btn-add" icon={<i className="fa fa-plus" />}
            label={f('add-folder')} primary onTouchTap={this.openAddFolderDialog} />
        </div>
        {this.renderFolders()}
        <Pagination pathname="/" current={page} total={Math.ceil(folderCount / perpage)} onButtonTouchTap={this.handlePageButtonTouchTap} />
        {this.renderAddFolderDialog()}
      </div>
    );
  }
}
