import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import {cloneDeep} from 'lodash';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

import {setAddFolderDialogOpen, setSnackBarParams, setTargetLanguages} from './../../redux/modules/ui';
import objToArr from './../../helpers/objToArr';
import {addFolder, listFolders, setFolderPage} from './../../redux/modules/folder';
import AddFolderForm from './../../components/AddFolderForm/AddFolderForm';
import Pagination from './../../components/Pagination/Pagination';
import TopBar from './../../components/TopBar/TopBar';

import sortContentFields from './../../helpers/sortContentFields';
import injectF from './../../helpers/injectF';
import injectPush from './../../helpers/injectPush';
import resolve from './../../helpers/resolve';

const styles = require('./PageFolders.scss');

@connect(({ui, folder}) => ({
  targetLanguages: ui.get('targetLanguages'),
  page: folder.get('page'),
  perpage: folder.get('perpage'),
  folders: folder.get('folders'),
  folderCount: folder.get('folderCount'),
  isAddFolderDialogOpen: ui.get('isAddFolderDialogOpen')
}), {listFolders, setAddFolderDialogOpen, addFolder, setFolderPage, setSnackBarParams, setTargetLanguages})
@injectPush
@injectF
@resolve(({dispatch}, {page, perpage}) => {
  return dispatch(listFolders({page, perpage}));
})
export default class PageFolders extends Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    f: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    perpage: PropTypes.number.isRequired,
    setFolderPage: PropTypes.func.isRequired,
    setTargetLanguages: PropTypes.func.isRequired,
    targetLanguages: PropTypes.array.isRequired,
    addFolder: PropTypes.func.isRequired,
    folders: PropTypes.array.isRequired,
    folderCount: PropTypes.number.isRequired,
    listFolders: PropTypes.func.isRequired,
    isAddFolderDialogOpen: PropTypes.bool.isRequired,
    setAddFolderDialogOpen: PropTypes.func.isRequired,
    setSnackBarParams: PropTypes.func.isRequired
  };

  componentWillReceiveProps(nextProps) {
    const {page, perpage, listFolders} = this.props;
    if ((page !== nextProps.page) || (perpage !== nextProps.perpage)) {
      listFolders({
        page: nextProps.page,
        perpage: nextProps.perpage
      });
    }
  }

  openAddFolderDialog = () => {
    this.props.setTargetLanguages([]);
    this.props.setAddFolderDialogOpen(true);
  };

  handleAddFolderDialogClose = () => this.props.setAddFolderDialogOpen(false);

  handleSubmit = async (data) => {

    const {f, addFolder, setAddFolderDialogOpen, listFolders,
      page, perpage, setSnackBarParams} = this.props;

    data.contentFields = sortContentFields(data.contentFields);

    await addFolder(data);
    await listFolders({page, perpage});

    setSnackBarParams(true, f('folder-has-been-created', {folderName: data.folderName}));
    setAddFolderDialogOpen(false);
  };

  handleCancelButtonTouchTap = () => this.props.setAddFolderDialogOpen(false);

  handleTargetLanguagesChange = (rawData) => {
    const data = cloneDeep(rawData);
    delete data.preventDefault;
    this.props.setTargetLanguages(objToArr(data));
  };

  renderAddFolderDialog() {

    const {isAddFolderDialogOpen, f, targetLanguages} = this.props;

    return (
      <Dialog title={f('add-a-folder')} open={isAddFolderDialogOpen}
        bodyStyle={{paddingLeft: '8px', paddingRight: '8px', paddingBottom: '8px'}}
        onRequestClose={this.handleAddFolderDialogClose}>
        <AddFolderForm ref="addFolderForm" onSubmit={this.handleSubmit} targetLanguages={targetLanguages}
          onTargetLanguagesChange={this.handleTargetLanguagesChange}
          onCancelButtonTouchTap={this.handleCancelButtonTouchTap} />
      </Dialog>
    );
  }

  handleFolderAnchorTouchTap = (folderId) => {
    return () => this.props.push(`/folders/${folderId}/entries`);
  };

  handleFolderMenuItemTouchTap = (event, value) => {
    const {type, id} = value;
    switch (type) {
      case 'edit':
        return this.props.push(`/folders/${id}/edit`);
      case 'export':
      default:
    }
  };

  renderFolders() {
    const {f, folders} = this.props;

    return folders.map((folder) => {
      const {id, name} = folder;
      return (
        <Paper className={styles.folder} key={`paper-${id}`}>
          <a className={styles.folderName} onTouchTap={this.handleFolderAnchorTouchTap(id)}>{name}</a>
          <IconMenu className={styles.folderIconMenu} style={{display: 'block', position: 'absolute'}}
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            onChange={this.handleFolderMenuItemTouchTap}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}>
            <MenuItem primaryText={f('edit')} value={{type: 'edit', id}} />
            <MenuItem primaryText={f('export')} value={{type: 'export', id}} />
          </IconMenu>
        </Paper>
      );
    });
  }

  handlePageButtonTouchTap = (page) => this.props.setFolderPage(page);

  render() {

    const {f, page, perpage, folderCount} = this.props;

    return (
      <div className={c('page-list', styles.pageFolders)}>
        <TopBar>
          <h2>{f('folders')}</h2>
          <FlatButton icon={<i className="fa fa-plus" />}
            label={f('add-folder')} primary onTouchTap={this.openAddFolderDialog} />
        </TopBar>
        {this.renderFolders()}
        {(folderCount > perpage) && <Pagination current={page} total={Math.ceil(folderCount / perpage)} onButtonTouchTap={this.handlePageButtonTouchTap} />}
        {this.renderAddFolderDialog()}
      </div>
    );
  }
}
