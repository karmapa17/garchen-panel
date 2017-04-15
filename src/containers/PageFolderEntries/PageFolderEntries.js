import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';

import {setSnackBarParams} from './../../redux/modules/main';
import {loadFolder} from './../../redux/modules/folder';
import {loadFolderEntries} from './../../redux/modules/folderEntry';

import injectF from './../../helpers/injectF';
import injectPush from './../../helpers/injectPush';
import resolve from './../../helpers/resolve';

const styles = require('./PageFolderEntries.scss');

@connect(({folder, folderEntry}) => ({
  folder: folder.get('folder'),
  folderEntries: folderEntry.get('folderEntries')
}), {loadFolderEntries, setSnackBarParams})
@injectPush
@injectF
@resolve(({dispatch}, {params}) => {

  const promises = [];
  promises.push(dispatch(loadFolder({id: params.id})));
  promises.push(dispatch(loadFolderEntries({folderId: params.id})));

  return Promise.all(promises);
})
export default class PageFolderEntries extends Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    f: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    folderEntries: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    loadFolderEntries: PropTypes.func.isRequired,
    setSnackBarParams: PropTypes.func.isRequired
  };

  renderFolderEntries() {
    const {folderEntries} = this.props;
    return folderEntries.map((entry) => {
      return (<div key={entry.id}>{entry.entry}</div>);
    });
  }

  goToAddFolderEntryPage = () => {
    const {folder, push} = this.props;
    push(`/folders/${folder.id}/entries/add`);
  };

  goToFoldersPage = () => this.props.push('/');

  goBack = () => this.props.push('/');

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
            <FlatButton icon={<i className="fa fa-plus" />}
              label={f('add-entry')} onTouchTap={this.goToAddFolderEntryPage} />
            <FlatButton icon={<i className="fa fa-arrow-left" />}
              label={f('back')} onTouchTap={this.goBack} />
          </div>
        </div>
        {this.renderFolderEntries()}
      </div>
    );
  }
}
