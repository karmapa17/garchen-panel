import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {range} from 'ramda';
import {Link} from 'react-router';

import TopBar from './../../components/TopBar/TopBar';
import Breadcrumb from './../Breadcrumb/Breadcrumb';
import {setSnackBarParams} from './../../redux/modules/ui';
import {getFolder} from './../../redux/modules/folder';
import {listFolderEntries, setSelectedFolderEntryIds, clearSelectedFolderEntryIds,
  deleteEntries} from './../../redux/modules/entry';

import injectF from './../../helpers/injectF';
import injectPush from './../../helpers/injectPush';
import resolve from './../../helpers/resolve';
import Pagination from './../../components/Pagination/Pagination';
import LocalSearchBar from './../../components/LocalSearchBar/LocalSearchBar';
import hasValue from './../../helpers/hasValue';
import getFontSize from './../../helpers/getFontSize';

const styles = require('./PageEntries.scss');
const SEARCH_TYPES = ['source-entry', 'page-num'];

@connect(({main, folder, entry}) => ({
  perpage: entry.get('perpage'),
  folder: folder.get('folder'),
  importingFolderId: folder.get('importingFolderId'),
  interfaceFontSizeScalingFactor: main.get('interfaceFontSizeScalingFactor'),
  folderEntries: entry.get('folderEntries'),
  folderEntryCount: entry.get('folderEntryCount'),
  selectedFolderEntryMap: entry.get('selectedFolderEntryMap')
}), {listFolderEntries, setSnackBarParams, setSelectedFolderEntryIds,
  deleteEntries, clearSelectedFolderEntryIds})
@injectPush
@injectF
@resolve(({dispatch}, {params, page, perpage}) => {

  const promises = [];
  promises.push(dispatch(getFolder({id: params.id})));
  promises.push(dispatch(listFolderEntries({folderId: params.id, page, perpage})));
  promises.push(dispatch(setSelectedFolderEntryIds([])));

  return Promise.all(promises);
})
export default class PageEntries extends Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    perpage: PropTypes.number.isRequired,
    f: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    folderEntries: PropTypes.array.isRequired,
    interfaceFontSizeScalingFactor: PropTypes.number.isRequired,
    folderEntryCount: PropTypes.number.isRequired,
    params: PropTypes.object.isRequired,
    listFolderEntries: PropTypes.func.isRequired,
    setSelectedFolderEntryIds: PropTypes.func.isRequired,
    clearSelectedFolderEntryIds: PropTypes.func.isRequired,
    selectedFolderEntryMap: PropTypes.object.isRequired,
    deleteEntries: PropTypes.func.isRequired,
    importingFolderId: PropTypes.number,
    setSnackBarParams: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      tableKey: 0,
      searchKeyword: '',
      searchType: 'source-entry'
    };
  }

  componentWillUpdate(nextProps, nextState) {
    const {page, searchKeyword, searchType} = this.state;
    const {perpage, listFolderEntries} = this.props;

    if ((page !== nextState.page) || (perpage !== nextProps.perpage) ||
        (searchKeyword !== nextState.searchKeyword) || (searchType !== nextState.searchType)) {

      listFolderEntries({
        folderId: nextProps.folder.id,
        page: nextState.page,
        perpage: nextProps.perpage,
        keyword: nextState.searchKeyword.trim(),
        type: nextState.searchType
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
    const nameColStyle = {fontSize, width: 'initial'};
    const {tableKey} = this.state;
    const {folderEntries} = this.props;

    const tableRows = folderEntries.map((entry) => {
      return (
        <TableRow key={`table-row-${entry.id}`}>
          <TableRowColumn style={nameColStyle}>
            <a onTouchTap={this.goToSingleFolderEntryPage(entry.id)}>{entry.sourceEntry}</a>
          </TableRowColumn>
        </TableRow>
      );
    });

    // https://github.com/callemall/material-ui/issues/6006#issuecomment-277669719
    const key = `table-workaround-${tableKey}`;

    return (
      <Table key={key} className={styles.entryTable} multiSelectable onRowSelection={this.handleRowSelection}>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn style={nameColStyle}>Name</TableHeaderColumn>
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

  goToFoldersPage = () => this.props.push('/');

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
  };

  renderDeleteButton() {
    const {selectedFolderEntryMap, f} = this.props;
    if (Object.keys(selectedFolderEntryMap).length > 0) {
      return <FlatButton label={f('delete')} icon={<i className="fa fa-trash" />} onTouchTap={this.deleteSelectedFolderEntries} />;
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
    this.refs.localSearchBar.getWrappedInstance().getWrappedInstance().clear();
  };

  isImporting() {
    const {folder, importingFolderId} = this.props;
    return folder.id === importingFolderId;
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
              label={f('back')} onTouchTap={this.goToFoldersPage} />
          </div>
        </TopBar>
        <div className={styles.content}>
          <LocalSearchBar ref="localSearchBar" onInputChange={this.handleSearchInputChange} searchTypes={SEARCH_TYPES}
            searchKeyword={searchKeyword} matchedCount={matchedCount}
            selectedSearchType={searchType} onSearchTypeChange={this.handleSearchTypeChange}
            onClearFilterButtonTouchTap={this.handleClearSearchButtonTouchTap} />
          {this.renderFolderEntries()}
          {(folderEntryCount > perpage) && <Pagination current={page} total={Math.ceil(folderEntryCount / perpage)}
            onButtonTouchTap={this.handlePageButtonTouchTap} />}
        </div>
      </div>
    );
  }
}
