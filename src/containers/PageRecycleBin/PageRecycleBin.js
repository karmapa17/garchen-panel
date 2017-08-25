import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React, {Component, PropTypes} from 'react';
import c from 'classnames';
import moment from 'moment';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {range, isEmpty} from 'lodash';
import Heading from './../Heading/Heading';
import Pagination from './../../components/Pagination/Pagination';
import TopBar from './../../components/TopBar/TopBar';
import injectF from './../../helpers/injectF';
import injectPush from './../../helpers/injectPush';
import resolve from './../../helpers/resolve';
import {listDeletedFolders, clearRecycleBin, restoreFolders, deleteFolders} from './../../redux/modules/folder';
import {setSnackBarParams} from './../../redux/modules/ui';

const styles = require('./PageRecycleBin.scss');

const connectFunc = connect(({folder}) => ({
  perpage: folder.get('deletedFolderPerPage'),
  folders: folder.get('deletedFolders'),
  folderCount: folder.get('deletedFolderCount')
}), {listDeletedFolders, setSnackBarParams, clearRecycleBin, restoreFolders, deleteFolders});

const resolveFunc = resolve(({dispatch}, {perpage}) => {
  const params = Object.assign({page: 1, perpage});
  return dispatch(listDeletedFolders(params))
    .then((res) => {
      if (isEmpty(res.data) && (params.page > 1)) {
        return dispatch(listDeletedFolders({page: params.page - 1, perpage, isDeleted: true}));
      }
      return res;
    });
});

export class PageRecycleBin extends Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    restoreFolders: PropTypes.func.isRequired,
    f: PropTypes.func.isRequired,
    perpage: PropTypes.number.isRequired,
    folders: PropTypes.array.isRequired,
    folderCount: PropTypes.number.isRequired,
    listDeletedFolders: PropTypes.func.isRequired,
    deleteFolders: PropTypes.func.isRequired,
    clearRecycleBin: PropTypes.func.isRequired,
    setSnackBarParams: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      targetLanguages: [],
      isAddFolderDialogOpen: false,
      tableKey: 0,
      selectedFolderIds: [],
      isConfirmClearRecycleBinDialogOpen: false
    };
  }

  componentWillUpdate(nextProps, nextState) {
    const {page} = this.state;
    const {perpage, listDeletedFolders} = this.props;
    const nextPage = nextState.page;

    if ((page !== nextPage) || (perpage !== nextProps.perpage)) {
      listDeletedFolders({
        page: nextPage,
        perpage: nextProps.perpage,
        isDeleted: true
      });
    }
  }

  setSelectedFolderIds(folderIds) {
    this.setState({selectedFolderIds: folderIds});
  }

  handleRowSelection = (res) => {

    const {perpage, folders} = this.props;

    let indices = res;

    if ('all' === res) {
      indices = range(0, perpage);
    }
    else if ('none' === res) {
      indices = [];
    }

    const folderIds = folders.filter((row, index) => (-1 !== indices.indexOf(index)))
      .map((row) => row.id);

    this.setSelectedFolderIds(folderIds);
  };

  updateTableKey = () => this.setState((prevState) => ({tableKey: prevState.tableKey + 1}));

  renderFolders() {
    const colStyle = {fontSize: '20px', width: 'initial'};
    const {tableKey} = this.state;
    const {folders, f} = this.props;

    const tableRows = folders.map((folder) => {
      return (
        <TableRow key={`table-row-${folder.id}`}>
          <TableRowColumn style={colStyle}>{folder.name}</TableRowColumn>
          <TableRowColumn style={colStyle}>{moment.unix(folder.deletedAt).format('YYYY-MM-DD hh:mm:ss')}</TableRowColumn>
        </TableRow>
      );
    });

    // https://github.com/callemall/material-ui/issues/6006#issuecomment-277669719
    const key = `table-workaround-${tableKey}`;

    return (
      <Table key={key} className={styles.folderTable} multiSelectable onRowSelection={this.handleRowSelection}>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn style={colStyle}>{f('folder-name')}</TableHeaderColumn>
            <TableHeaderColumn style={colStyle}>{f('deleted-at')}</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody showRowHover deselectOnClickaway={false}>{tableRows}</TableBody>
      </Table>
    );
  }

  handlePageButtonTouchTap = (newPage) => {
    const {page} = this.state;
    if (page !== newPage) {
      this.updateTableKey();
      this.setSelectedFolderIds([]);
      this.setState({page: newPage});
    }
  };

  restoreSelectedFolders = async () => {
    const {page, selectedFolderIds} = this.state;
    const {listDeletedFolders, restoreFolders, perpage, folderCount, setSnackBarParams, f} = this.props;
    await restoreFolders(selectedFolderIds);

    const totalPages = Math.ceil((folderCount - selectedFolderIds.length) / perpage);
    const nextPage = (page > totalPages) ? totalPages : page;
    await listDeletedFolders({page: nextPage, perpage});
    this.updateTableKey();
    setSnackBarParams(true, f('folders-have-been-restored'));
  };

  renderRecoverButton() {
    const {f} = this.props;
    const {selectedFolderIds} = this.state;
    if (selectedFolderIds.length > 0) {
      return <FlatButton label={f('restore')} icon={<i className="fa fa-window-restore" />} onTouchTap={this.restoreSelectedFolders} />;
    }
  }

  deleteSelectedFolders = async () => {
    const {f, deleteFolders, setSnackBarParams, folderCount, perpage, listDeletedFolders} = this.props;
    const {selectedFolderIds, page} = this.state;

    await deleteFolders(selectedFolderIds);
    const totalPages = Math.ceil((folderCount - selectedFolderIds.length) / perpage);
    const nextPage = (page > totalPages) ? totalPages : page;
    await listDeletedFolders({page: nextPage, perpage});
    setSnackBarParams(true, f('folders-have-been-deleted'));
    this.updateTableKey();
    this.setSelectedFolderIds([]);
  };

  renderDeleteSelectedFoldersButton() {
    const {f} = this.props;
    const {selectedFolderIds} = this.state;
    if (selectedFolderIds.length > 0) {
      return <FlatButton label={f('delete-selected-folders')} icon={<i className="fa fa-trash" />} onTouchTap={this.deleteSelectedFolders} />;
    }
  }

  clearRecycleBin = async () => {
    const {perpage, listDeletedFolders} = this.props;
    await this.props.clearRecycleBin();
    listDeletedFolders({page: 1, perpage});
    this.setState({page: 1});
    this.updateTableKey();
    this.closeConfirmClearRecycleBinDialog();
    this.setSelectedFolderIds([]);
  };

  openConfirmClearRecycleBinDialog = () => this.setState({isConfirmClearRecycleBinDialogOpen: true});

  closeConfirmClearRecycleBinDialog = () => this.setState({isConfirmClearRecycleBinDialogOpen: false});

  renderConfirmClearRecycleBinDialog() {
    const {isConfirmClearRecycleBinDialogOpen} = this.state;
    const {f} = this.props;
    const actions = [
      <FlatButton label={f('cancel')} primary onTouchTap={this.closeConfirmClearRecycleBinDialog} />,
      <FlatButton label={f('clear-recycle-bin')} primary keyboardFocused onTouchTap={this.clearRecycleBin} />
    ];
    return (
      <Dialog title={f('title-confirm-clear-recycle-bin-dialog')} actions={actions}
        modal={false} open={isConfirmClearRecycleBinDialogOpen} onRequestClose={this.closeConfirmClearRecycleBinDialog}>
        <p>{f('content-confirm-recycle-bin-dialog1')}</p>
        <p>{f('content-confirm-recycle-bin-dialog2')}</p>
      </Dialog>
    );
  }

  render() {

    const {page} = this.state;
    const {f, perpage, folderCount} = this.props;

    return (
      <div className={c('page-list', styles.pageRecycleBin)}>
        <TopBar>
          <Heading>{f('recycle-bin')}</Heading>
          <div>
            {this.renderRecoverButton()}
            {this.renderDeleteSelectedFoldersButton()}
            <FlatButton label={f('empty-recycle-bin')} icon={<i className="fa fa-trash" />}
              onTouchTap={this.openConfirmClearRecycleBinDialog} disabled={0 === folderCount} />
          </div>
        </TopBar>
        <div className={styles.content}>
          {this.renderFolders()}
          {(folderCount > perpage) && <Pagination current={page} total={Math.ceil(folderCount / perpage)} onButtonTouchTap={this.handlePageButtonTouchTap} />}
        </div>
        {this.renderConfirmClearRecycleBinDialog()}
      </div>
    );
  }
}

export default compose(connectFunc, injectPush, injectF, resolveFunc)(PageRecycleBin);
