import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {range} from 'ramda';
import {Link} from 'react-router';

import TopBar from './../../components/TopBar/TopBar';
import Breadcrumb from './../../components/Breadcrumb/Breadcrumb';
import {setSnackBarParams} from './../../redux/modules/main';
import {getFolder} from './../../redux/modules/folder';
import {listFolderEntries, setSelectedFolderEntryIds, setFolderEntryPage} from './../../redux/modules/folderEntry';
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
  selectedFolderEntryIds: folderEntry.get('selectedFolderEntryIds')
}), {listFolderEntries, setSnackBarParams, setSelectedFolderEntryIds, deleteEntries, setFolderEntryPage})
@injectPush
@injectF
@resolve(({dispatch}, {params, page, perpage}) => {

  const promises = [];
  promises.push(dispatch(getFolder({id: params.id})));
  promises.push(dispatch(listFolderEntries({folderId: params.id, page, perpage})));
  promises.push(dispatch(setSelectedFolderEntryIds([])));

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
    setSelectedFolderEntryIds: PropTypes.func.isRequired,
    selectedFolderEntryIds: PropTypes.array.isRequired,
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
    const idColStyle = {fontSize, width: '60px'};
    const nameColStyle = {fontSize, width: 'initial'};

    const {folderEntries} = this.props;
    const tableRows = folderEntries.map((entry) => {
      return (
        <TableRow key={`table-row-${entry.id}`}>
          <TableRowColumn style={idColStyle}>{entry.id}</TableRowColumn>
          <TableRowColumn style={nameColStyle}>
            <a onTouchTap={this.goToSingleFolderEntryPage(entry.id)}>{entry.sourceEntry}</a>
          </TableRowColumn>
        </TableRow>
      );
    });

    return (
      <Table className={styles.entryTable} multiSelectable onRowSelection={this.handleRowSelection}>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn style={idColStyle}>ID</TableHeaderColumn>
            <TableHeaderColumn style={nameColStyle}>Name</TableHeaderColumn>
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

    const {selectedFolderEntryIds, f, deleteEntries, page, perpage, params, listFolderEntries,
      setSnackBarParams, folderEntryCount} = this.props;

    const ids = selectedFolderEntryIds;
    await deleteEntries({ids});
    const totalPages = Math.ceil((folderEntryCount - ids.length) / perpage);
    const nextPage = (page > totalPages) ? totalPages : page;

    await listFolderEntries({folderId: params.id, page: nextPage, perpage});
    setSnackBarParams(true, f('folder-entries-has-been-deleted', {count: ids.length}));
  };

  renderDeleteButton() {
    const {selectedFolderEntryIds, f} = this.props;
    if (selectedFolderEntryIds.length > 0) {
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
            <Link to="/">{f('folders')}</Link>
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
        <div className={styles.content}>
          {this.renderFolderEntries()}
          {(folderEntryCount > perpage) && <Pagination current={page} total={Math.ceil(folderEntryCount / perpage)}
            onButtonTouchTap={this.handlePageButtonTouchTap} />}
        </div>
      </div>
    );
  }
}
