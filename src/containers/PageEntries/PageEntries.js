import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {range} from 'ramda';
import {Link} from 'react-router';
import {get, isEmpty} from 'lodash';
import CircularProgress from 'material-ui/CircularProgress';
import TopBar from './../../components/TopBar/TopBar';
import Breadcrumb from './../../components/Breadcrumb/Breadcrumb';
import {setSnackBarParams} from './../../redux/modules/ui';
import {getFolder} from './../../redux/modules/folder';
import {listFolderEntries, setSelectedFolderEntryIds, clearSelectedFolderEntryIds,
  deleteEntries} from './../../redux/modules/entry';
import {setCachePageEntries} from './../../redux/modules/cache';
import bindAppHistory from './../../utils/bindAppHistory';

import injectF from './../../utils/injectF';
import injectPush from './../../utils/injectPush';
import resolve from './../../utils/resolve';
import Pagination from './../../components/Pagination/Pagination';
import PageJumper from './../../components/PageJumper/PageJumper';
import SearchBar from './../../components/SearchBar/SearchBar';
import hasValue from './../../utils/hasValue';
import SEARCH_TYPES from './../../constants/searchTypes';

const styles = require('./PageEntries.scss');

const SORT_METHODS = ['', 'asc', 'desc'];
const SORT_CLASSNAME_MAP = {
  ['']: 'fa fa-sort',
  asc: 'fa fa-sort-asc',
  desc: 'fa fa-sort-desc'
};

// how to access params outside of react component
// https://github.com/reactjs/react-router-redux#how-do-i-access-router-state-in-a-container-component
@connect(({main, folder, entry, cache, routing}, {params}) => {
  const folderId = parseInt(params.id, 10);
  return {
    cache: get(cache.get('cachePageEntriesDataSet'), folderId, {}),
    isListingFolderEntries: entry.get('isListingFolderEntries'),
    perpage: entry.get('perpage'),
    folder: folder.get('folder'),
    importingFolderId: folder.get('importingFolderId'),
    folderEntries: entry.get('folderEntries'),
    folderEntryCount: entry.get('folderEntryCount'),
    selectedFolderEntryMap: entry.get('selectedFolderEntryMap')
  };
}, {listFolderEntries, setSnackBarParams, setSelectedFolderEntryIds, setCachePageEntries,
  deleteEntries, clearSelectedFolderEntryIds})
@injectPush
@injectF
@bindAppHistory
@resolve(({dispatch}, {params, page, perpage, cache}) => {

  const promises = [];
  const folderId = params.id;

  promises.push(dispatch(getFolder({id: folderId})));
  promises.push(dispatch(setSelectedFolderEntryIds([])));

  const searchParams = Object.assign({
    folderId,
    page,
    perpage,
    pageNumSortMethod: ''
  }, cache);

  const promiseToListEntries = dispatch(listFolderEntries(searchParams))
    .then(res => {
      if (isEmpty(res.data) && (searchParams.page > 1)) {
        searchParams.page -= 1;
        return dispatch(listFolderEntries(searchParams));
      }
      return res;
    });

  promises.push(promiseToListEntries);

  return Promise.all(promises);
})
export default class PageEntries extends Component {

  static propTypes = {
    cache: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    perpage: PropTypes.number.isRequired,
    goBack: PropTypes.func.isRequired,
    f: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    folderEntries: PropTypes.array.isRequired,
    isListingFolderEntries: PropTypes.bool.isRequired,
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
    const [pageNumSortMethod] = SORT_METHODS;
    this.state = Object.assign({
      page: 1,
      tableKey: 0,
      searchKeyword: '',
      searchType: 'source-entry',
      pageNumSortMethod,
      isConfirmEntryDeletionOpen: false
    }, props.cache);

    if (! this.hasPageNumField()) {
      this.state.pageNumSortMethod = '';
      this.state.searchType = 'source-entry';
    }
  }

  hasPageNumField() {
    return this.props.folder.data.contentFields.includes('page-num');
  }

  componentWillUpdate(nextProps, nextState) {
    const {page, searchKeyword, searchType, pageNumSortMethod} = this.state;
    const {perpage, listFolderEntries, setCachePageEntries} = this.props;
    const nextPage = nextState.page;
    const nextPerpage = nextProps.perpage;
    const nextSearchKeyword = nextState.searchKeyword;
    const nextSearchType = nextState.searchType;
    const folderId = nextProps.folder.id;
    const nextPageNumSortMethod = nextState.pageNumSortMethod;

    if ((page !== nextPage) || (perpage !== nextPerpage) ||
        (searchKeyword !== nextSearchKeyword) || (searchType !== nextSearchType) || (pageNumSortMethod !== nextPageNumSortMethod)) {

      setCachePageEntries(folderId, {
        page: nextPage,
        searchKeyword: nextSearchKeyword,
        searchType: nextSearchType,
        pageNumSortMethod: nextPageNumSortMethod
      });

      listFolderEntries({
        folderId,
        page: nextPage,
        perpage: nextPerpage,
        searchKeyword: nextSearchKeyword.trim(),
        searchType: nextSearchType,
        pageNumSortMethod: nextPageNumSortMethod
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

  changePageNumberSortMethod = () => {
    const {pageNumSortMethod} = this.state;
    const index = SORT_METHODS.indexOf(pageNumSortMethod);
    const nextIndex = (index + 1) % 3;
    this.setState({pageNumSortMethod: SORT_METHODS[nextIndex]});
  };

  renderFolderEntries() {

    const fontSize = 20;
    const colStyle = {fontSize, width: 'initial'};
    const {page, tableKey, pageNumSortMethod} = this.state;
    const {folderEntries, f, folderEntryCount, perpage, isListingFolderEntries} = this.props;

    if (isListingFolderEntries) {
      return (
        <CircularProgress mode="indeterminate" size={80}
          style={{textAlign: 'center', marginTop: '80px', marginRight: 'auto', marginLeft: 'auto', display: 'block'}} />
      );
    }

    const isPageNumVisible = this.hasPageNumField();

    const tableRows = folderEntries.map((entry) => {
      return (
        <TableRow key={`table-row-${entry.id}`}>
          <TableRowColumn style={colStyle}>
            <a onTouchTap={this.goToSingleFolderEntryPage(entry.id)}>{entry.sourceEntry}</a>
          </TableRowColumn>
          {isPageNumVisible && <TableRowColumn style={colStyle}>{get(entry, 'pageNum', '')}</TableRowColumn>}
        </TableRow>
      );
    });

    // https://github.com/callemall/material-ui/issues/6006#issuecomment-277669719
    const key = `table-workaround-${tableKey}`;
    const total = Math.ceil(folderEntryCount / perpage);

    return (
      <div>
        <Table key={key} className={styles.entryTable} multiSelectable onRowSelection={this.handleRowSelection}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn style={colStyle}>{f('source-entry')}</TableHeaderColumn>
              {isPageNumVisible && <TableHeaderColumn style={colStyle}>
                <span>{f('page-num')}</span>
                <button className={styles.btnSort} onClick={this.changePageNumberSortMethod}>
                  <i className={SORT_CLASSNAME_MAP[pageNumSortMethod]} />
                </button>
              </TableHeaderColumn>}
            </TableRow>
          </TableHeader>
          <TableBody showRowHover deselectOnClickaway={false}>{tableRows}</TableBody>
        </Table>
        <div className={styles.pageEntriesPaginationBar}>
          {(folderEntryCount > perpage) && <Pagination current={page} total={total}
            onButtonTouchTap={this.handlePageButtonTouchTap} />}
          {(folderEntryCount > perpage) && <PageJumper current={page} total={total}
            onInputSubmit={this.handlePageInputSubmit} />}
        </div>
      </div>
    );
  }

  goToAddFolderEntryPage = () => {
    const {folder, push} = this.props;
    push(`/folders/${folder.id}/entries/add`);
  };

  updateTableKey = () => this.setState((prevState) => ({tableKey: prevState.tableKey + 1}));

  deleteSelectedFolderEntries = async () => {

    const {page, pageNumSortMethod} = this.state;
    const {selectedFolderEntryMap, f, deleteEntries, perpage, params, listFolderEntries,
      setSnackBarParams, folderEntryCount, clearSelectedFolderEntryIds} = this.props;

    const ids = Object.keys(selectedFolderEntryMap);
    await deleteEntries({ids});
    clearSelectedFolderEntryIds();
    const totalPages = Math.ceil((folderEntryCount - ids.length) / perpage);
    const nextPage = (page > totalPages) ? totalPages : page;

    await listFolderEntries({folderId: params.id, page: nextPage, perpage, pageNumSortMethod});
    this.setState({page: nextPage});
    setSnackBarParams(true, f('folder-entries-has-been-deleted', {count: ids.length}));
    this.updateTableKey();
    this.closeConfirmEntryDeletionDialog();
  };

  renderDeleteButton() {
    const {selectedFolderEntryMap, f} = this.props;
    if (Object.keys(selectedFolderEntryMap).length > 0) {
      return <FlatButton label={f('delete')} icon={<i className="fa fa-trash" />} onTouchTap={this.openConfirmEntryDeletionDialog} />;
    }
  }

  handlePageButtonTouchTap = (page) => {
    this.updateTableKey();
    this.setState({page});
  };

  handlePageInputSubmit = (page) => {
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
    const {f} = this.props;
    const actions = [
      <FlatButton label={f('cancel')} primary onTouchTap={this.closeConfirmEntryDeletionDialog} />,
      <FlatButton label={f('delete')} primary keyboardFocused onTouchTap={this.deleteSelectedFolderEntries} />
    ];
    return (
      <Dialog title={f('title-confirm-delete-dialog')} actions={actions}
        modal={false} open={isConfirmEntryDeletionOpen} onRequestClose={this.closeConfirmEntryDeletionDialog}>
        <p>{f('content-confirm-delete-dialog1')}</p>
        <p>{f('content-confirm-delete-dialog2')}</p>
      </Dialog>
    );
  }

  render() {

    const {searchType, searchKeyword} = this.state;
    const {f, folder, isListingFolderEntries, goBack} = this.props;
    const matchedCount = this.getMatchedCount();

    let pageNumProps = {};

    if (this.hasPageNumField()) {
      pageNumProps = {
        searchTypes: SEARCH_TYPES,
        selectedSearchType: searchType,
        onSearchTypeChange: this.handleSearchTypeChange
      };
    }

    return (
      <div className={c('page-list', styles.pageFolderEntries)}>
        <TopBar>
          <Breadcrumb>
            <Link to="/">{f('folders')}</Link>
            <span>{f('folder-entries', {folderName: folder.name})}</span>
          </Breadcrumb>
          <div>
            {this.renderDeleteButton()}
            <FlatButton icon={<i className="fa fa-plus" />} label={f('add-entry')} onTouchTap={this.goToAddFolderEntryPage} disabled={this.isImporting()} />
            <FlatButton icon={<i className="fa fa-arrow-left" />} label={f('back')} onTouchTap={goBack} />
          </div>
        </TopBar>
        <div className={styles.content}>
          <SearchBar ref="searchBar" onInputChange={this.handleSearchInputChange}
            searchKeyword={searchKeyword} matchedCount={matchedCount} isLoading={isListingFolderEntries}
            onClearFilterButtonTouchTap={this.handleClearSearchButtonTouchTap} {...pageNumProps} />
          {this.renderFolderEntries()}
        </div>
        {this.renderConfirmEntryDeletionDialog()}
      </div>
    );
  }
}
