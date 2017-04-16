import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {range} from 'ramda';

import {setSnackBarParams} from './../../redux/modules/main';
import {loadFolder} from './../../redux/modules/folder';
import {loadFolderEntries, setSelectedFolderEntryIndices} from './../../redux/modules/folderEntry';

import injectF from './../../helpers/injectF';
import injectPush from './../../helpers/injectPush';
import resolve from './../../helpers/resolve';

const styles = require('./PageFolderEntries.scss');

@connect(({folder, folderEntry}) => ({
  page: folderEntry.get('page'),
  perpage: folderEntry.get('perpage'),
  folder: folder.get('folder'),
  folderEntries: folderEntry.get('folderEntries'),
  selectedFolderEntryIndices: folderEntry.get('selectedFolderEntryIndices')
}), {loadFolderEntries, setSnackBarParams, setSelectedFolderEntryIndices})
@injectPush
@injectF
@resolve(({dispatch}, {params, page, perpage}) => {

  const promises = [];
  promises.push(dispatch(loadFolder({id: params.id})));
  promises.push(dispatch(loadFolderEntries({folderId: params.id, page, perpage})));

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
    params: PropTypes.object.isRequired,
    loadFolderEntries: PropTypes.func.isRequired,
    setSelectedFolderEntryIndices: PropTypes.func.isRequired,
    selectedFolderEntryIndices: PropTypes.array.isRequired,
    setSnackBarParams: PropTypes.func.isRequired
  };

  handleRowSelection = (res) => {
    const {setSelectedFolderEntryIndices, perpage} = this.props;
    const indices = ('all' === res) ? range(0, perpage) : res;
    setSelectedFolderEntryIndices(indices);
  };

  renderFolderEntries() {

    const rowStyle = {fontSize: 20};

    const {folderEntries} = this.props;
    const tableRows = folderEntries.map((entry) => {
      return (
        <TableRow key={`table-row-${entry.id}`}>
          <TableRowColumn style={rowStyle}>{entry.id}</TableRowColumn>
          <TableRowColumn style={rowStyle}>{entry.sourceEntry}</TableRowColumn>
        </TableRow>
      );
    });

    return (
      <Table className={styles.entryTable} multiSelectable onRowSelection={this.handleRowSelection}>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn style={rowStyle}>ID</TableHeaderColumn>
            <TableHeaderColumn style={rowStyle}>Name</TableHeaderColumn>
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

  renderDeleteButton() {
    const {selectedFolderEntryIndices, f} = this.props;
    if (selectedFolderEntryIndices.length > 0) {
      return <FlatButton label={f('delete')} icon={<i className="fa fa-trash" />} />;
    }
  }

  render() {

    const {f, folder} = this.props;

    return (
      <div className={c('page-list', styles.pageFolderEntries)}>
        <div className="topbar">
          <ul className="breadcrumb">
            <li>
              <FlatButton label={f('folders')} onTouchTap={this.goToFoldersPage} />
            </li>
            <li>
              <span>{f('folder-entries', {folderName: folder.name})}</span>
            </li>
          </ul>
          <div>
            {this.renderDeleteButton()}
            <FlatButton icon={<i className="fa fa-plus" />}
              label={f('add-entry')} onTouchTap={this.goToAddFolderEntryPage} />
            <FlatButton icon={<i className="fa fa-arrow-left" />}
              label={f('back')} onTouchTap={this.goToFoldersPage} />
          </div>
        </div>
        {this.renderFolderEntries()}
      </div>
    );
  }
}
