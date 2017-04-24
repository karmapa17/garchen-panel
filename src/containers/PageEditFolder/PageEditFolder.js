import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';
import {cloneDeep} from 'lodash';

import objToArr from './../../helpers/objToArr';
import sortContentFields from './../../helpers/sortContentFields';
import EditFolderForm from './../../components/EditFolderForm/EditFolderForm';
import DeleteFolderForm from './../../components/DeleteFolderForm/DeleteFolderForm';
import {getFolder, updateFolder, deleteFolder} from './../../redux/modules/folder';
import {setSnackBarParams, setTargetLanguages} from './../../redux/modules/main';
import injectF from './../../helpers/injectF';
import resolve from './../../helpers/resolve';
import injectPush from './../../helpers/injectPush';
import TopBar from './../../components/TopBar/TopBar';
import Breadcrumb from './../../components/Breadcrumb/Breadcrumb';

const styles = require('./PageEditFolder.scss');

@connect(({main, folder}) => ({
  folder: folder.get('folder'),
  targetLanguages: main.get('targetLanguages')
}), {getFolder, updateFolder, setSnackBarParams, deleteFolder, setTargetLanguages})
@injectF
@injectPush
@resolve(({dispatch, getState}, {params}) => {
  return dispatch(getFolder({id: params.id}));
})
export default class PageEditFolder extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    getFolder: PropTypes.func.isRequired,
    deleteFolder: PropTypes.func.isRequired,
    targetLanguages: PropTypes.array.isRequired,
    setTargetLanguages: PropTypes.func.isRequired,
    setSnackBarParams: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    updateFolder: PropTypes.func.isRequired
  };

  handleTargetLanguagesChange = (rawData) => {
    const data = cloneDeep(rawData);
    delete data.preventDefault;
    this.props.setTargetLanguages(objToArr(data));
  };

  handleEditFolderFormSubmit = async (data) => {
    const {f, params, updateFolder, push, setSnackBarParams} = this.props;
    data.id = params.id;
    data.contentFields = sortContentFields(data.contentFields);
    const folder = await updateFolder(data);
    setSnackBarParams(true, f('folder-has-been-updated', {folderName: folder.name}));
    push('/');
  };

  handleDeleteFolderFormSubmit = async () => {
    const {f, deleteFolder, folder, push, setSnackBarParams} = this.props;
    await deleteFolder({id: folder.id});
    setSnackBarParams(true, f('folder-has-been-deleted', {folderName: folder.name}));
    push('/');
  };

  goToFoldersPage = () => this.props.push('/');

  componentWillMount() {
    const {folder, setTargetLanguages} = this.props;
    setTargetLanguages(folder.data.targetLanguages);
  }

  render() {

    const {f, folder, targetLanguages} = this.props;
    const {sourceLanguage, contentFields} = folder.data;
    const initialValues = {
      id: folder.id,
      folderName: folder.name,
      targetLanguages: folder.data.targetLanguages,
      sourceLanguage,
      contentFields,
      source: folder.source
    };

    return (
      <div className={c('page-edit', styles.pageEditFolder)}>
        <TopBar>
          <Breadcrumb>
            <FlatButton label={f('folders')} onTouchTap={this.goToFoldersPage} />
            <span>{f('edit-folder')}</span>
          </Breadcrumb>
          <FlatButton icon={<i className="fa fa-arrow-left" />}
            label={f('back')} onTouchTap={this.goToFoldersPage} />
        </TopBar>
        <EditFolderForm onSubmit={this.handleEditFolderFormSubmit}
          initialValues={initialValues} onTargetLanguagesChange={this.handleTargetLanguagesChange} targetLanguages={targetLanguages} />
        <DeleteFolderForm className={styles.deleteFolderForm} initialValues={{targetFolderName: folder.name}}
          onSubmit={this.handleDeleteFolderFormSubmit} />
      </div>
    );
  }
}
