import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';

import AddFolderEntryForm from './../../components/AddFolderEntryForm/AddFolderEntryForm';
import {loadFolder} from './../../redux/modules/folder';
import {setSnackBarParams} from './../../redux/modules/main';
import injectF from './../../helpers/injectF';
import resolve from './../../helpers/resolve';
import injectPush from './../../helpers/injectPush';

const styles = require('./PageAddFolderEntry.scss');

@connect(({folder}) => ({
  folder: folder.get('folder'),
}), {setSnackBarParams})
@injectF
@injectPush
@resolve(({dispatch, getState}, {params}) => {
  return dispatch(loadFolder({id: params.id}));
})
export default class PageAddFolderEntry extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    setSnackBarParams: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  };

  handleSubmit = (data) => {
    console.log('data', data);
  };

  goBack = () => {
    const {folder, push} = this.props;
    push(`/folders/${folder.id}/entries`);
  };

  render() {

    const {f, folder} = this.props;

    return (
      <div className={c('page-add', styles.pageAddFolderEntry)}>
        <div className="topbar">
          <h2>{f('add-folder-entry')}</h2>
          <FlatButton icon={<i className="fa fa-arrow-left" />}
            label={f('back')} primary onTouchTap={this.goBack} />
        </div>
        <AddFolderEntryForm onSubmit={this.handleSubmit} folder={folder} />
      </div>
    );
  }
}
