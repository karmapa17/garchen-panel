import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import {range, isEmpty} from 'lodash';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';

import {setSnackBarParams} from './../../redux/modules/ui';
import {listDeletedFolders, clearRecycleBin, restoreFolders} from './../../redux/modules/folder';
import Pagination from './../../components/Pagination/Pagination';
import TopBar from './../../components/TopBar/TopBar';
import Heading from './../Heading/Heading';
import getFontSize from './../../helpers/getFontSize';

import injectF from './../../helpers/injectF';
import injectPush from './../../helpers/injectPush';
import resolve from './../../helpers/resolve';

const styles = require('./PageRecycleBin.scss');

@connect(({main, folder}) => ({
  interfaceFontSizeScalingFactor: main.get('interfaceFontSizeScalingFactor'),
  perpage: folder.get('deletedFoldersPerPage'),
  folders: folder.get('deletedFolders'),
  folderCount: folder.get('deletedFolderCount')
}), {listDeletedFolders, setSnackBarParams, clearRecycleBin, restoreFolders})
@injectPush
@injectF
@resolve(({dispatch}, {perpage}) => {
  const params = Object.assign({page: 1, perpage});
  return dispatch(listDeletedFolders(params))
    .then((res) => {
      if (isEmpty(res.data) && (params.page > 1)) {
        return dispatch(listDeletedFolders({page: params.page - 1, perpage, isDeleted: true}));
      }
      return res;
    });
})
export default class PageRecycleBin extends Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    restoreFolders: PropTypes.func.isRequired,
    f: PropTypes.func.isRequired,
    perpage: PropTypes.number.isRequired,
    folders: PropTypes.array.isRequired,
    folderCount: PropTypes.number.isRequired,
    listDeletedFolders: PropTypes.func.isRequired,
    interfaceFontSizeScalingFactor: PropTypes.number.isRequired,
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
      selectedFolderIds: []
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

  renderFolders() {
    const fontSize = 20;
    const colStyle = {fontSize, width: 'initial'};
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
      this.setState({
        page: newPage,
        selectedFolderIdData: {}
      });
    }
  };

  getButtonFontSize() {
    return getFontSize(this.props.interfaceFontSizeScalingFactor, 0.9);
  }

  restoreSelectedFolders = async () => {
    const {page, selectedFolderIds} = this.state;
    const {listDeletedFolders, restoreFolders, perpage, folderCount, setSnackBarParams, f} = this.props;
    await restoreFolders(selectedFolderIds);

    const totalPages = Math.ceil((folderCount - selectedFolderIds.length) / perpage);
    const nextPage = (page > totalPages) ? totalPages : page;
    await listDeletedFolders({page: nextPage, perpage});
    setSnackBarParams(true, f('folders-have-been-restored'));
  };

  renderRecoverButton() {
    const {f} = this.props;
    const {selectedFolderIds} = this.state;
    if (selectedFolderIds.length > 0) {
      return (
        <FlatButton label={f('restore')} labelStyle={{fontSize: this.getButtonFontSize()}}
          icon={<i className="fa fa-window-restore" />} onTouchTap={this.restoreSelectedFolders} />
      );
    }
  }

  clearRecycleBin = () => {
    const {perpage, listDeletedFolders} = this.props;
    this.props.clearRecycleBin();
    listDeletedFolders({page: 1, perpage});
    this.setState({page: 1});
  };

  render() {

    const {page} = this.state;
    const {f, perpage, folderCount} = this.props;

    return (
      <div className={c('page-list', styles.pageRecycleBin)}>
        <TopBar>
          <Heading>{f('recycle-bin')}</Heading>
          <div>
            {this.renderRecoverButton()}
            <FlatButton label={f('empty-recycle-bin')} labelStyle={{fontSize: this.getButtonFontSize()}}
              icon={<i className="fa fa-trash" />} onTouchTap={this.clearRecycleBin} />
          </div>
        </TopBar>
        {this.renderFolders()}
        {(folderCount > perpage) && <Pagination current={page} total={Math.ceil(folderCount / perpage)} onButtonTouchTap={this.handlePageButtonTouchTap} />}
      </div>
    );
  }
}
