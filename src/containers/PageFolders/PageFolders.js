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
import LinearProgress from 'material-ui/LinearProgress';

import {setSnackBarParams} from './../../redux/modules/ui';
import {addFolder, listFolders} from './../../redux/modules/folder';
import AddFolderForm from './../../components/AddFolderForm/AddFolderForm';
import Pagination from './../../components/Pagination/Pagination';
import TopBar from './../../components/TopBar/TopBar';

import sortFolderContentFields from './../../main/helpers/sortFolderContentFields';
import injectF from './../../helpers/injectF';
import injectPush from './../../helpers/injectPush';
import resolve from './../../helpers/resolve';

const styles = require('./PageFolders.scss');

@connect(({folder}) => ({
  perpage: folder.get('perpage'),
  folders: folder.get('folders'),
  importingFolderId: folder.get('importingFolderId'),
  folderCount: folder.get('folderCount')
}), {listFolders, addFolder, setSnackBarParams})
@injectPush
@injectF
@resolve(({dispatch}, {perpage}) => {
  return dispatch(listFolders({page: 1, perpage}));
})
export default class PageFolders extends Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    f: PropTypes.func.isRequired,
    perpage: PropTypes.number.isRequired,
    addFolder: PropTypes.func.isRequired,
    folders: PropTypes.array.isRequired,
    folderCount: PropTypes.number.isRequired,
    listFolders: PropTypes.func.isRequired,
    importingFolderId: PropTypes.number,
    setSnackBarParams: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      targetLanguages: [],
      isAddFolderDialogOpen: false
    };
  }

  componentWillUpdate(nextProps, nextState) {
    const {page} = this.state;
    const {perpage, listFolders} = this.props;
    if ((page !== nextState.page) || (perpage !== nextProps.perpage)) {
      listFolders({
        page: nextState.page,
        perpage: nextProps.perpage
      });
    }
  }

  openAddFolderDialog = () => {
    this.setState({
      targetLanguages: [],
      isAddFolderDialogOpen: true
    });
  };

  handleAddFolderDialogClose = () => this.setState({isAddFolderDialogOpen: false});

  handleSubmit = async (data) => {

    const {page} = this.state;
    const {f, addFolder, listFolders,
      perpage, setSnackBarParams} = this.props;

    data.contentFields = sortFolderContentFields(data.contentFields);

    await addFolder(data);
    await listFolders({page, perpage});

    setSnackBarParams(true, f('folder-has-been-created', {folderName: data.folderName}));
    this.setState({isAddFolderDialogOpen: false});
  };

  handleCancelButtonTouchTap = () => this.setState({isAddFolderDialogOpen: false});

  handleTargetLanguagesChange = (rawData) => {
    const data = cloneDeep(rawData);
    delete data.preventDefault;
    this.setState({targetLanguages: Object.values(data)});
  };

  renderAddFolderDialog() {

    const {targetLanguages, isAddFolderDialogOpen} = this.state;
    const {f} = this.props;

    return (
      <Dialog title={f('add-a-folder')} open={isAddFolderDialogOpen}
        bodyStyle={{paddingLeft: '8px', paddingRight: '8px', paddingBottom: '8px'}} autoScrollBodyContent
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
    const {f, folders, importingFolderId} = this.props;
    const rows = folders.map((folder) => {
      const {id, name} = folder;
      const isImporting = (importingFolderId === folder.id);
      return (
        <Paper className={styles.folder} key={`paper-${id}`}>
          {isImporting && <LinearProgress mode="indeterminate" style={{marginBottom: '7px'}} />}
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
    return <div>{rows}</div>;
  }

  handlePageButtonTouchTap = (page) => this.setState({page});

  render() {

    const {page} = this.state;
    const {f, perpage, folderCount} = this.props;

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
