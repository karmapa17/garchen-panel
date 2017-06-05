import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {range} from 'ramda';
import {Link} from 'react-router';
import {get} from 'lodash';
import {hashHistory} from 'react-router';

import TopBar from './../../components/TopBar/TopBar';
import Breadcrumb from './../Breadcrumb/Breadcrumb';
import {setSnackBarParams} from './../../redux/modules/ui';
import {getFolder} from './../../redux/modules/folder';
import {listFolderEntries, setSelectedFolderEntryIds, clearSelectedFolderEntryIds,
  deleteEntries} from './../../redux/modules/entry';
import {setCachePageEntries} from './../../redux/modules/cache';

import injectF from './../../helpers/injectF';
import injectPush from './../../helpers/injectPush';
import resolve from './../../helpers/resolve';
import Pagination from './../../components/Pagination/Pagination';
import SearchBar from './../../components/SearchBar/SearchBar';
import hasValue from './../../helpers/hasValue';
import getFontSize from './../../helpers/getFontSize';
import SEARCH_TYPES from './../../constants/searchTypes';

const styles = require('./PageEntries.scss');

@connect(({main, folder, entry, cache}) => {
  const folderRow = folder.get('folder');
  const folderId = get(folderRow, 'id', '');
  return {
    cache: get(cache.get('cachePageEntriesDataSet'), folderId, {}),
    perpage: entry.get('perpage'),
    folder: folderRow,
    importingFolderId: folder.get('importingFolderId'),
    interfaceFontSizeScalingFactor: main.get('interfaceFontSizeScalingFactor'),
    folderEntries: entry.get('folderEntries'),
    folderEntryCount: entry.get('folderEntryCount'),
    selectedFolderEntryMap: entry.get('selectedFolderEntryMap')
  };
}, {listFolderEntries, setSnackBarParams, setSelectedFolderEntryIds, setCachePageEntries,
  deleteEntries, clearSelectedFolderEntryIds})
@injectPush
@injectF
@resolve(({dispatch}, {params, page, perpage, cache}) => {

  const promises = [];
  promises.push(dispatch(getFolder({id: params.id})));
  promises.push(dispatch(setSelectedFolderEntryIds([])));

  const folderId = params.id;

  const searchParams = Object.assign({
    folderId,
    page,
    perpage
  }, cache);
  promises.push(dispatch(listFolderEntries(searchParams)));

  return Promise.all(promises);
})
export default class PageEntries extends Component {

  static propTypes = {
    cache: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    perpage: PropTypes.number.isRequired,
    f: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    folderEntries: PropTypes.array.isRequired,
    interfaceFontSizeScalingFactor: PropTypes.number.isRequired,
    folderEntryCount: PropTypes.number.isRequired,
    params: PropTypes.object.isRequired,
    listFolderEntries: PropTypes.func.isRequired,
    setCachePageEntries: PropTypes.func.isRequired,
    setSelectedFolderEntryIds: PropTypes.func.isRequired,
    clearSelectedFolderEntryIds: PropTypes.func.isRequired,
    selectedFolderEntryMap: PropTypes.object.isRequired,
    deleteEntries: PropTypes.func.isRequired,
    importingFolderId: PropTypes.number,
    setSnackBarParams: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = Object.assign({
      page: 1,
      tableKey: 0,
      searchKeyword: '',
      searchType: 'source-entry',
      isConfirmEntryDeletionOpen: false
    }, props.cache);
  }

  componentWillUpdate(nextProps, nextState) {
    const {page, searchKeyword, searchType} = this.state;
    const {perpage, listFolderEntries, setCachePageEntries} = this.props;
    const nextPage = nextState.page;
    const nextPerpage = nextProps.perpage;
    const nextSearchKeyword = nextState.searchKeyword;
    const nextSearchType = nextState.searchType;
    const folderId = nextProps.folder.id;

    if ((page !== nextPage) || (perpage !== nextPerpage) ||
        (searchKeyword !== nextSearchKeyword) || (searchType !== nextSearchType)) {

      setCachePageEntries(folderId, {
        page: nextPage,
        searchKeyword: nextSearchKeyword,
        searchType: nextSearchType
      });

      listFolderEntries({
        folderId,
        page: nextPage,
        perpage: nextPerpage,
        searchKeyword: nextSearchKeyword.trim(),
        searchType: nextSearchType
      });
    }
  }

  handleRowSelection = (res) => {

    const {setSelectedFolderEntryIds, perpage, folderEntries} = this.props;

    let indices = res;

    if ('all' === res) {
      indices = range(0, perpage);
    }
    else if ('none' === res) {
      indices = [];
    }

    const ids = folderEntries.filter((row, index) => (-1 !== indices.indexOf(index)))
      .map((row) => row.id);

    setSelectedFolderEntryIds(ids);
  };

  goToSingleFolderEntryPage = (entryId) => {
    const {folder, push} = this.props;
    return () => push(`/folders/${folder.id}/entries/${entryId}`);
  };

  renderFolderEntries() {

    const fontSize = 20;
    const colStyle = {fontSize, width: 'initial'};
    const {tableKey} = this.state;
    const {folderEntries, f} = this.props;

    const tableRows = folderEntries.map((entry) => {
      return (
        <TableRow key={`table-row-${entry.id}`}>
          <TableRowColumn style={colStyle}>
            <a onTouchTap={this.goToSingleFolderEntryPage(entry.id)}>{entry.sourceEntry}</a>
          </TableRowColumn>
          <TableRowColumn style={colStyle}>{get(entry, 'data.page-num', '')}</TableRowColumn>
        </TableRow>
      );
    });

    // https://github.com/callemall/material-ui/issues/6006#issuecomment-277669719
    const key = `table-workaround-${tableKey}`;

    return (
      <Table key={key} className={styles.entryTable} multiSelectable onRowSelection={this.handleRowSelection}>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn style={colStyle}>{f('source-entry')}</TableHeaderColumn>
            <TableHeaderColumn style={colStyle}>{f('page-num')}</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody showRowHover deselectOnClickaway={false}>{tableRows}</TableBody>
      </Table>
    );
  }

  goToAddFolderEntryPage = () => {
    const {folder, push} = this.props;
    push(`/folders/${folder.id}/entries/add`);
  };

  updateTableKey = () => this.setState((prevState) => ({tableKey: prevState.tableKey + 1}));

  deleteSelectedFolderEntries = async () => {

    const {page} = this.state;
    const {selectedFolderEntryMap, f, deleteEntries, perpage, params, listFolderEntries,
      setSnackBarParams, folderEntryCount, clearSelectedFolderEntryIds} = this.props;

    const ids = Object.keys(selectedFolderEntryMap);
    await deleteEntries({ids});
    clearSelectedFolderEntryIds();
    const totalPages = Math.ceil((folderEntryCount - ids.length) / perpage);
    const nextPage = (page > totalPages) ? totalPages : page;

    await listFolderEntries({folderId: params.id, page: nextPage, perpage});
    this.setState({page: nextPage});
    setSnackBarParams(true, f('folder-entries-has-been-deleted', {count: ids.length}));
    this.updateTableKey();
    this.closeConfirmEntryDeletionDialog();
  };

  renderDeleteButton() {
    const {selectedFolderEntryMap, f, interfaceFontSizeScalingFactor} = this.props;
    if (Object.keys(selectedFolderEntryMap).length > 0) {
      const buttonFontSize = getFontSize(interfaceFontSizeScalingFactor, 0.9);
      return (
        <FlatButton label={f('delete')} labelStyle={{fontSize: buttonFontSize}}
          icon={<i className="fa fa-trash" />} onTouchTap={this.openConfirmEntryDeletionDialog} />
      );
    }
  }

  handlePageButtonTouchTap = (page) => {
    this.updateTableKey();
    this.setState({page});
  };

  handleSearchInputChange = (searchKeyword) => {
    if (this.state.searchKeyword !== searchKeyword) {
      this.setState({page: 1});
    }
    this.setState({searchKeyword});
  };

  handleSearchTypeChange = (event, key, searchType) => this.setState({searchType});

  getMatchedCount() {

    const {searchKeyword} = this.state;
    const {folderEntryCount} = this.props;

    if (hasValue(searchKeyword)) {
      return folderEntryCount;
    }
    return 0;
  }

  handleClearSearchButtonTouchTap = () => {
    this.setState({searchKeyword: ''});
    this.refs.searchBar.getWrappedInstance().getWrappedInstance().clear();
  };

  isImporting() {
    const {folder, importingFolderId} = this.props;
    return folder.id === importingFolderId;
  }

  openConfirmEntryDeletionDialog = () => this.setState({isConfirmEntryDeletionOpen: true});

  closeConfirmEntryDeletionDialog = () => this.setState({isConfirmEntryDeletionOpen: false});

  renderConfirmEntryDeletionDialog() {
    const {isConfirmEntryDeletionOpen} = this.state;
    const {f, interfaceFontSizeScalingFactor} = this.props;
    const dialogContentFontSize = getFontSize(interfaceFontSizeScalingFactor, 1.2);
    const dialogContentLineHeight = getFontSize(interfaceFontSizeScalingFactor, 1.2);
    const pStyle = {
      fontSize: dialogContentFontSize,
      lineHeight: dialogContentLineHeight
    };
    const actions = [
      <FlatButton label={f('cancel')} primary onTouchTap={this.closeConfirmEntryDeletionDialog} />,
      <FlatButton label={f('delete')} primary keyboardFocused onTouchTap={this.deleteSelectedFolderEntries} />
    ];
    return (
      <Dialog title={f('title-confirm-delete-dialog')} actions={actions}
        modal={false} open={isConfirmEntryDeletionOpen} onRequestClose={this.closeConfirmEntryDeletionDialog}>
        <p style={pStyle}>{f('content-confirm-delete-dialog1')}</p>
        <p style={pStyle}>{f('content-confirm-delete-dialog2')}</p>
      </Dialog>
    );
  }

  render() {

    const {page, searchType, searchKeyword} = this.state;
    const {f, folder, folderEntryCount, perpage, interfaceFontSizeScalingFactor} = this.props;
    const matchedCount = this.getMatchedCount();
    const buttonFontSize = getFontSize(interfaceFontSizeScalingFactor, 0.9);

    return (
      <div className={c('page-list', styles.pageFolderEntries)}>
        <TopBar>
          <Breadcrumb>
            <Link to="/">{f('folders')}</Link>
            <span>{f('folder-entries', {folderName: folder.name})}</span>
          </Breadcrumb>
          <div>
            {this.renderDeleteButton()}
            <FlatButton icon={<i className="fa fa-plus" />} labelStyle={{fontSize: buttonFontSize}}
              label={f('add-entry')} onTouchTap={this.goToAddFolderEntryPage} disabled={this.isImporting()} />
            <FlatButton icon={<i className="fa fa-arrow-left" />} labelStyle={{fontSize: buttonFontSize}}
              label={f('back')} onTouchTap={hashHistory.goBack} />
          </div>
        </TopBar>
        <div className={styles.content}>
          <SearchBar ref="searchBar" onInputChange={this.handleSearchInputChange} searchTypes={SEARCH_TYPES}
            searchKeyword={searchKeyword} matchedCount={matchedCount}
            selectedSearchType={searchType} onSearchTypeChange={this.handleSearchTypeChange}
            onClearFilterButtonTouchTap={this.handleClearSearchButtonTouchTap} />
          {this.renderFolderEntries()}
          {(folderEntryCount > perpage) && <Pagination current={page} total={Math.ceil(folderEntryCount / perpage)}
            onButtonTouchTap={this.handlePageButtonTouchTap} />}
        </div>
        {this.renderConfirmEntryDeletionDialog()}
      </div>
    );
  }
}
