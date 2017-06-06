import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';
import {cloneDeep} from 'lodash';
import {Link} from 'react-router';

import sortFolderContentFields from './../../main/helpers/sortFolderContentFields';
import filterFolderContentFields from './../../helpers/filterFolderContentFields';
import EditFolderForm from './../../components/EditFolderForm/EditFolderForm';
import {getFolder, updateFolder} from './../../redux/modules/folder';
import {deleteCachePageEntries} from './../../redux/modules/cache';
import {setSnackBarParams} from './../../redux/modules/ui';
import injectF from './../../helpers/injectF';
import resolve from './../../helpers/resolve';
import injectPush from './../../helpers/injectPush';
import TopBar from './../../components/TopBar/TopBar';
import Breadcrumb from './../Breadcrumb/Breadcrumb';
import getFontSize from './../../helpers/getFontSize';

const styles = require('./PageEditFolder.scss');

@connect(({main, folder}) => ({
  interfaceFontSizeScalingFactor: main.get('interfaceFontSizeScalingFactor'),
  folder: folder.get('folder')
}), {getFolder, updateFolder, setSnackBarParams, deleteCachePageEntries})
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
    interfaceFontSizeScalingFactor: PropTypes.number.isRequired,
    setSnackBarParams: PropTypes.func.isRequired,
    deleteCachePageEntries: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    updateFolder: PropTypes.func.isRequired
  };

  componentWillMount() {
    const {folder} = this.props;
    this.setState({targetLanguages: folder.data.targetLanguages});
  }

  handleTargetLanguagesChange = (rawData) => {
    const data = cloneDeep(rawData);
    delete data.preventDefault;
    this.setState({targetLanguages: Object.values(data)});
  };

  handleEditFolderFormSubmit = async (data) => {
    const {f, params, updateFolder, push, setSnackBarParams} = this.props;
    data.id = params.id;

    let contentFields = data.contentFields;
    contentFields = sortFolderContentFields(contentFields);
    data.contentFields = filterFolderContentFields(data.targetLanguages, contentFields);

    const folder = await updateFolder(data);
    setSnackBarParams(true, f('folder-has-been-updated', {folderName: folder.name}));
    push('/');
  };

  goToFoldersPage = () => this.props.push('/');

  render() {

    const {targetLanguages} = this.state;
    const {f, folder, interfaceFontSizeScalingFactor} = this.props;
    const {sourceLanguage, contentFields} = folder.data;
    const initialValues = {
      id: folder.id,
      folderName: folder.name,
      targetLanguages: folder.data.targetLanguages,
      sourceLanguage,
      contentFields,
      source: folder.source
    };
    const buttonFontSize = getFontSize(interfaceFontSizeScalingFactor, 1.1);

    return (
      <div className={c('page-edit', styles.pageEditFolder)}>
        <TopBar>
          <Breadcrumb>
            <Link to="/">{f('folders')}</Link>
            <span>{f('edit-folder')}</span>
          </Breadcrumb>
          <FlatButton icon={<i className="fa fa-arrow-left" />} labelStyle={{fontSize: buttonFontSize}}
            label={f('back')} onTouchTap={this.goToFoldersPage} />
        </TopBar>
        <EditFolderForm onSubmit={this.handleEditFolderFormSubmit} buttonFontSize={buttonFontSize}
          initialValues={initialValues} onTargetLanguagesChange={this.handleTargetLanguagesChange} targetLanguages={targetLanguages} />
      </div>
    );
  }
}
