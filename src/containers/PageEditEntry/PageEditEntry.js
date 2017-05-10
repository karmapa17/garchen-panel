import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import {each, isArray} from 'lodash';

import {getFolder} from './../../redux/modules/folder';
import {getEntry, updateEntry} from './../../redux/modules/entry';
import {setSnackBarParams} from './../../redux/modules/main';
import injectF from './../../helpers/injectF';
import resolve from './../../helpers/resolve';
import injectPush from './../../helpers/injectPush';
import TopBar from './../../components/TopBar/TopBar';
import Breadcrumb from './../../components/Breadcrumb/Breadcrumb';
import EditEntryForm from './../../components/EditEntryForm/EditEntryForm';
import filterLastContinuousUndefinedValues from './../../helpers/filterLastContinuousUndefinedValues';

const styles = require('./PageEditEntry.scss');

@connect(({folder, entry}) => ({
  folder: folder.get('folder'),
  entry: entry.get('entry')
}), {setSnackBarParams, updateEntry})
@injectF
@injectPush
@resolve(({dispatch, getState}, {params}) => {
  const promises = [];
  promises.push(dispatch(getFolder({id: params.folderId})));
  promises.push(dispatch(getEntry({id: params.entryId})));
  return Promise.all(promises);
})
export default class PageEditEntry extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    updateEntry: PropTypes.func.isRequired,
    setSnackBarParams: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  };

  goBack = () => {
    const {folder, push} = this.props;
    push(`/folders/${folder.id}/entries`);
  };

  goToFoldersPage = () => this.props.push('/');

  handleSubmit = async (rawData) => {

    const {entry, updateEntry, setSnackBarParams, f} = this.props;
    const data = Object.keys(rawData).reduce((obj, prop) => {
      const value = rawData[prop];
      obj[prop] = isArray(value) ? filterLastContinuousUndefinedValues(value) : value;
      return obj;
    }, {});

    await updateEntry({
      id: entry.id,
      data
    });
    this.goBack();
    setSnackBarParams(true, f('folder-entry-has-been-updated', {sourceEntry: data.sourceEntry}));
  };

  render() {

    const {f, folder, entry} = this.props;

    const initialValues = {
      entryId: entry.id,
      folderId: folder.id,
      sourceEntry: entry.sourceEntry
    };

    each(entry.data, (value, prop) => {
      if (isArray(value)) {
        each(value, (v, p, index) => {
          initialValues[`${prop}[${index}]`] = v;
        });
      }
      else {
        initialValues[prop] = value;
      }
    });

    return (
      <div className={styles.pageFolderEntry}>
        <TopBar>
          <Breadcrumb>
            <FlatButton label={f('folders')} onTouchTap={this.goToFoldersPage} />
            <FlatButton label={f('folder-entries', {folderName: folder.name})} onTouchTap={this.goBack} />
            <span>{f('edit-folder-entry', {sourceEntry: entry.sourceEntry})}</span>
          </Breadcrumb>
          <FlatButton icon={<i className="fa fa-arrow-left" />}
            label={f('back')} primary onTouchTap={this.goBack} />
        </TopBar>
        <EditEntryForm onSubmit={this.handleSubmit} folder={folder} initialValues={initialValues} />
      </div>
    );
  }
}
