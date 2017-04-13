import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';

import EditFolderForm from './../../components/EditFolderForm/EditFolderForm';
import {loadFolder, updateFolder} from './../../redux/modules/folder';
import injectF from './../../helpers/injectF';
import resolve from './../../helpers/resolve';
import injectPush from './../../helpers/injectPush';

const styles = require('./PageEditFolder.scss');

@connect(({folder}) => ({
  folder: folder.get('folder'),
}), {loadFolder, updateFolder})
@injectF
@injectPush
@resolve(({dispatch, getState}, {params}) => {
  return dispatch(loadFolder({id: params.id}));
})
export default class PageEditFolder extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    loadFolder: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    updateFolder: PropTypes.func.isRequired
  };

  handleSubmit = async (data) => {
    const {params, updateFolder, push} = this.props;
    data.id = params.id;
    await updateFolder(data);
    push('/');
  };

  render() {

    const {f} = this.props;

    return (
      <div className={c('page-edit', styles.pageEditFolder)}>
        <h1>{f('edit-folder')}</h1>
        <EditFolderForm onSubmit={this.handleSubmit} />
      </div>
    );
  }
}
