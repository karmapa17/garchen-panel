import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import {isEmpty, cloneDeep} from 'lodash';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import LinearProgress from 'material-ui/LinearProgress';

import {setSnackBarParams} from './../../redux/modules/ui';
import {addFolder, listFolders, exportFolderToCsv, markDeletedAtToFolders} from './../../redux/modules/folder';
import {setCachePageFolders} from './../../redux/modules/cache';
import AddFolderForm from './../../components/AddFolderForm/AddFolderForm';
import Pagination from './../../components/Pagination/Pagination';
import TopBar from './../../components/TopBar/TopBar';
import Heading from './../Heading/Heading';
import getFontSize from './../../helpers/getFontSize';

import sortFolderContentFields from './../../main/helpers/sortFolderContentFields';
import injectF from './../../helpers/injectF';
import injectPush from './../../helpers/injectPush';
import resolve from './../../helpers/resolve';

const styles = require('./PageFolders.scss');

@connect(({main, folder, cache}) => ({
  cache: cache.get('cachePageFolders'),
  interfaceFontSizeScalingFactor: main.get('interfaceFontSizeScalingFactor'),
  perpage: folder.get('perpage'),
  folders: folder.get('folders'),
  importingFolderId: folder.get('importingFolderId'),
  folderCount: folder.get('folderCount')
}), {listFolders, addFolder, setSnackBarParams, exportFolderToCsv, setCachePageFolders, markDeletedAtToFolders})
@injectPush
@injectF
@resolve(({dispatch}, {perpage, cache}) => {
  const params = Object.assign({page: 1, perpage}, cache);
  return dispatch(listFolders(params))
    .then((res) => {
      if (isEmpty(res.data) && (params.page > 1)) {
        return dispatch(listFolders({page: params.page - 1, perpage}));
      }
      return res;
    });
})
export default class PageFolders extends Component {

  static propTypes = {
    cache: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    exportFolderToCsv: PropTypes.func.isRequired,
    f: PropTypes.func.isRequired,
    perpage: PropTypes.number.isRequired,
    addFolder: PropTypes.func.isRequired,
    markDeletedAtToFolders: PropTypes.func.isRequired,
    folders: PropTypes.array.isRequired,
    folderCount: PropTypes.number.isRequired,
    listFolders: PropTypes.func.isRequired,
    setCachePageFolders: PropTypes.func.isRequired,
    importingFolderId: PropTypes.number,
    interfaceFontSizeScalingFactor: PropTypes.number.isRequired,
    setSnackBarParams: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = Object.assign({
      page: 1,
      targetLanguages: [],
      isAddFolderDialogOpen: false,
      selectedFolderIdData: {}
    }, props.cache);
  }

  componentWillUpdate(nextProps, nextState) {
    const {page} = this.state;
    const {perpage, listFolders, setCachePageFolders} = this.props;
    const nextPage = nextState.page;

    if ((page !== nextPage) || (perpage !== nextProps.perpage)) {
      setCachePageFolders({page: nextPage});
      listFolders({
        page: nextPage,
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
    const {push, exportFolderToCsv, f, setSnackBarParams, folders} = this.props;
    const {type, folderId} = value;
    const folder = folders.find((row) => row.id === folderId);

    switch (type) {
      case 'edit':
        return push(`/folders/${folderId}/edit`);
      case 'export':
        return exportFolderToCsv(folderId)
          .then(() => setSnackBarParams(true, f('folder-has-been-exported', {folderName: folder.name})));
      default:
    }
  };

  isImportingFolder(folderId) {
    return (folderId === this.props.importingFolderId);
  }

  handleFolderSelect = (folderId) => {
    return (event) => {
      // only work for folder DIV, anchor and the "more" dropdown menu should be ignored
      if ('DIV' !== event.target.tagName) {
        return;
      }
      // don't select importing folder
      if (this.isImportingFolder(folderId)) {
        return;
      }
      const {selectedFolderIdData} = this.state;

      if (folderId in selectedFolderIdData) {
        delete selectedFolderIdData[folderId];
      }
      else {
        selectedFolderIdData[folderId] = true;
      }
      this.setState({selectedFolderIdData});
    };
  };

  renderFolders() {
    const {selectedFolderIdData} = this.state;
    const {f, folders, interfaceFontSizeScalingFactor} = this.props;
    const linkFontSize = getFontSize(interfaceFontSizeScalingFactor, 1);
    const menuItemFontSize = getFontSize(interfaceFontSizeScalingFactor, 0.9);
    const rows = folders.map((folder) => {
      const {id, name} = folder;
      const isImporting = this.isImportingFolder(folder.id);
      const className = c({
        [styles.folder]: true,
        [styles.selected]: id in selectedFolderIdData
      });
      return (
        <div className={className} key={`paper-${id}`} onTouchTap={this.handleFolderSelect(id)}>
          {isImporting && <LinearProgress mode="indeterminate" style={{marginBottom: '7px'}} />}
          <a style={{fontSize: linkFontSize}} className={styles.folderName} onTouchTap={this.handleFolderAnchorTouchTap(id)}>{name}</a>
          {(! isImporting) && <IconMenu className={styles.folderIconMenu} style={{display: 'block', position: 'absolute'}}
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            onChange={this.handleFolderMenuItemTouchTap}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}>
            <MenuItem primaryText={f('edit')} value={{type: 'edit', folderId: id}} style={{fontSize: menuItemFontSize}} />
            <MenuItem primaryText={f('export')} value={{type: 'export', folderId: id}} style={{fontSize: menuItemFontSize}} />
          </IconMenu>}
        </div>
      );
    });
    return <div className={styles.folderBox}>{rows}</div>;
  }

  handlePageButtonTouchTap = (newPage) => {
    const {page} = this.state;
    if (page !== newPage) {
      this.setState({
        page: newPage,
        selectedFolderIdData: {}
      });
    }
  };

  goToPageCrossFolderSearch = () => this.props.push('cross-folder-search');

  deleteSelectedFolders = async () => {
    const {f, markDeletedAtToFolders, listFolders, perpage, folderCount, setSnackBarParams} = this.props;
    const {page, selectedFolderIdData} = this.state;
    const folderIds = Object.keys(selectedFolderIdData).map(Number);
    await markDeletedAtToFolders(folderIds);
    this.setState({selectedFolderIdData: {}});

    const totalPages = Math.ceil((folderCount - folderIds.length) / perpage);
    const nextPage = (page > totalPages) ? totalPages : page;
    listFolders({page: nextPage, perpage});
    setSnackBarParams(true, f('folders-have-been-deleted'));
  };

  renderDeleteButton() {
    const {f, interfaceFontSizeScalingFactor} = this.props;
    const {selectedFolderIdData} = this.state;
    if (Object.keys(selectedFolderIdData).length > 0) {
      const buttonFontSize = getFontSize(interfaceFontSizeScalingFactor, 0.9);
      return (
        <FlatButton label={f('delete')} labelStyle={{fontSize: buttonFontSize}}
          icon={<i className="fa fa-trash" />} onTouchTap={this.deleteSelectedFolders} />
      );
    }
  }

  render() {

    const {page} = this.state;
    const {f, perpage, folderCount, interfaceFontSizeScalingFactor} = this.props;
    const buttonFontSize = getFontSize(interfaceFontSizeScalingFactor, 0.9);

    return (
      <div className={c('page-list', styles.pageFolders)}>
        <TopBar>
          <Heading>{f('folders')}</Heading>
          <div>
            {this.renderDeleteButton()}
            <FlatButton icon={<i className="fa fa-search" />} labelStyle={{fontSize: buttonFontSize}}
              label={f('cross-folder-search')} primary onTouchTap={this.goToPageCrossFolderSearch} />
            <FlatButton icon={<i className="fa fa-plus" />} labelStyle={{fontSize: buttonFontSize}}
              label={f('add-folder')} primary onTouchTap={this.openAddFolderDialog} />
          </div>
        </TopBar>
        {this.renderFolders()}
        {(folderCount > perpage) && <Pagination current={page} total={Math.ceil(folderCount / perpage)} onButtonTouchTap={this.handlePageButtonTouchTap} />}
        {this.renderAddFolderDialog()}
      </div>
    );
  }
}
