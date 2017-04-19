import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {range} from 'ramda';

import TopBar from './../../components/TopBar/TopBar';
import Breadcrumb from './../../components/Breadcrumb/Breadcrumb';
import {setSnackBarParams} from './../../redux/modules/main';
import {getFolder} from './../../redux/modules/folder';
import {listFolderEntries, setSelectedFolderEntryIndices, setFolderEntryPage} from './../../redux/modules/folderEntry';
import {deleteEntries} from './../../redux/modules/entry';
import injectF from './../../helpers/injectF';
import injectPush from './../../helpers/injectPush';
import resolve from './../../helpers/resolve';
import Pagination from './../../components/Pagination/Pagination';

const styles = require('./PageFolderEntries.scss');

@connect(({folder, folderEntry}) => ({
  page: folderEntry.get('page'),
  perpage: folderEntry.get('perpage'),
  folder: folder.get('folder'),
  folderEntries: folderEntry.get('folderEntries'),
  folderEntryCount: folderEntry.get('folderEntryCount'),
  selectedFolderEntryIndices: folderEntry.get('selectedFolderEntryIndices')
}), {listFolderEntries, setSnackBarParams, setSelectedFolderEntryIndices, deleteEntries, setFolderEntryPage})
@injectPush
@injectF
@resolve(({dispatch}, {params, page, perpage}) => {

  const promises = [];
  promises.push(dispatch(getFolder({id: params.id})));
  promises.push(dispatch(listFolderEntries({folderId: params.id, page, perpage})));
  promises.push(dispatch(setSelectedFolderEntryIndices([])));

  return Promise.all(promises);
})
export default class PageFolderEntries extends Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    perpage: PropTypes.number.isRequired,
    f: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    folderEntries: PropTypes.array.isRequired,
    folderEntryCount: PropTypes.number.isRequired,
    params: PropTypes.object.isRequired,
    listFolderEntries: PropTypes.func.isRequired,
    setSelectedFolderEntryIndices: PropTypes.func.isRequired,
    selectedFolderEntryIndices: PropTypes.array.isRequired,
    deleteEntries: PropTypes.func.isRequired,
    setFolderEntryPage: PropTypes.func.isRequired,
    setSnackBarParams: PropTypes.func.isRequired
  };

  componentWillReceiveProps(nextProps) {
    const {page, perpage, listFolderEntries} = this.props;
    if ((page !== nextProps.page) || (perpage !== nextProps.perpage)) {

      listFolderEntries({
        folderId: nextProps.folder.id,
        page: nextProps.page,
        perpage: nextProps.perpage
      });
    }
  }

  handleRowSelection = (res) => {

    const {setSelectedFolderEntryIndices, perpage} = this.props;

    let indices = res;

    if ('all' === res) {
      indices = range(0, perpage);
    }
    else if ('none' === res) {
      indices = [];
    }

    setSelectedFolderEntryIndices(indices);
  };

  goToSingleFolderEntryPage = (entryId) => {
    const {folder, push} = this.props;
    return () => push(`/folders/${folder.id}/entries/${entryId}`);
  };

  handleInfoButtonClick = (entryId) => {
    return (event) => {
      const {folder, push} = this.props;
      event.preventDefault();
      push(`/folders/${folder.id}/entries/${entryId}`);
    };
  };

  handleEditButtonClick = (entryId) => {
    return (event) => {
      // have to use onClick instead of onTouchTap to workaround this
      // https://github.com/zilverline/react-tap-event-plugin/issues/54
      event.preventDefault();
      const {folder, push} = this.props;
      push(`/folders/${folder.id}/entries/${entryId}/edit`);
    };
  };

  renderFolderEntries() {

    const rowStyle = {fontSize: 20};

    const {f, folderEntries} = this.props;
    const tableRows = folderEntries.map((entry) => {
      return (
        <TableRow key={`table-row-${entry.id}`}>
          <TableRowColumn style={rowStyle}>{entry.id}</TableRowColumn>
          <TableRowColumn style={rowStyle}>
            <a onTouchTap={this.goToSingleFolderEntryPage(entry.id)}>{entry.sourceEntry}</a>
          </TableRowColumn>
          <TableRowColumn style={rowStyle}>
            <FlatButton label={f('info')} onClick={this.handleInfoButtonClick(entry.id)} />
          </TableRowColumn>
          <TableRowColumn style={rowStyle}>
            <FlatButton label={f('edit')} onClick={this.handleEditButtonClick(entry.id)} />
          </TableRowColumn>
        </TableRow>
      );
    });

    return (
      <Table className={styles.entryTable} multiSelectable onRowSelection={this.handleRowSelection}>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn style={rowStyle}>ID</TableHeaderColumn>
            <TableHeaderColumn style={rowStyle}>Name</TableHeaderColumn>
            <TableHeaderColumn style={rowStyle} />
            <TableHeaderColumn style={rowStyle} />
          </TableRow>
        </TableHeader>
        <TableBody>{tableRows}</TableBody>
      </Table>
    );
  }

  goToAddFolderEntryPage = () => {
    const {folder, push} = this.props;
    push(`/folders/${folder.id}/entries/add`);
  };

  goToFoldersPage = () => this.props.push('/');

  deleteSelectedFolderEntries = async () => {

    const {selectedFolderEntryIndices, folderEntries, f,
      deleteEntries, page, perpage, params, listFolderEntries,
      setSnackBarParams} = this.props;

    const ids = folderEntries.filter((row, index) => (-1 !== selectedFolderEntryIndices.indexOf(index)))
      .map((row) => row.id);
    await deleteEntries({ids});

    if ((ids.length === perpage) && (page > 1)) {
      await listFolderEntries({folderId: params.id, page: page - 1, perpage});
    }
    else {
      await listFolderEntries({folderId: params.id, page, perpage});
    }
    setSnackBarParams(true, f('folder-entries-has-been-deleted', {count: ids.length}));
  };

  renderDeleteButton() {
    const {selectedFolderEntryIndices, f} = this.props;
    if (selectedFolderEntryIndices.length > 0) {
      return <FlatButton label={f('delete')} icon={<i className="fa fa-trash" />} onTouchTap={this.deleteSelectedFolderEntries} />;
    }
  }

  handlePageButtonTouchTap = (page) => this.props.setFolderEntryPage(page);

  render() {

    const {f, folder, folderEntryCount, page, perpage} = this.props;

    return (
      <div className={c('page-list', styles.pageFolderEntries)}>
        <TopBar>
          <Breadcrumb>
            <FlatButton label={f('folders')} onTouchTap={this.goToFoldersPage} />
            <span>{f('folder-entries', {folderName: folder.name})}</span>
          </Breadcrumb>
          <div>
            {this.renderDeleteButton()}
            <FlatButton icon={<i className="fa fa-plus" />}
              label={f('add-entry')} onTouchTap={this.goToAddFolderEntryPage} />
            <FlatButton icon={<i className="fa fa-arrow-left" />}
              label={f('back')} onTouchTap={this.goToFoldersPage} />
          </div>
        </TopBar>
        {this.renderFolderEntries()}
        {(folderEntryCount > perpage) && <Pagination current={page} total={Math.ceil(folderEntryCount / perpage)}
          onButtonTouchTap={this.handlePageButtonTouchTap} />}
      </div>
    );
  }
}
