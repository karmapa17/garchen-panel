import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';

import {loadFolders} from './../../redux/modules/folder';

const styles = require('./PageFolderList.scss');

@connect(({folder}) => ({
  folders: folder.get('folders')
}), {loadFolders})
export default class PageFolderList extends Component {

  static propTypes = {
    folders: PropTypes.array.isRequired,
    loadFolders: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.loadFolders();
  }

  render() {

    return (
      <div className={c('container', 'list', styles.pageFolderList)}>
        <div className="topbar">
          <h2>Folders</h2>
          <button className="btn-add">
            <i className="fa fa-plus" />
            <span>Add Folder</span>
          </button>
        </div>
      </div>
    );
  }
}
