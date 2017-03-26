import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Button} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

import {loadFolders} from './../../redux/modules/folder';
import {mapConnect} from './../../helpers';

const styles = require('./PageFolderList.scss');

@connect((state) => mapConnect(state, {
  folders: 'folder.folders'
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
      <div className={classNames('container', 'list', styles.pageFolderList)}>

        <div className="topbar">
          <h2>Folders</h2>

          <LinkContainer to="/folders/add">
            <Button className="btn-add">
              <i className="fa fa-plus" />
              <span>Add Folder</span>
            </Button>
          </LinkContainer>
        </div>

      </div>
    );
  }
}
