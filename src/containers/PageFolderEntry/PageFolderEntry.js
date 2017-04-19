import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';

import {getFolder} from './../../redux/modules/folder';
import {getEntry} from './../../redux/modules/entry';
import {setSnackBarParams} from './../../redux/modules/main';
import injectF from './../../helpers/injectF';
import resolve from './../../helpers/resolve';
import injectPush from './../../helpers/injectPush';
import sortEntryKeys from './../../helpers/sortEntryKeys';
import entryKeysToDataRows from './../../helpers/entryKeysToDataRows';
import TopBar from './../../components/TopBar/TopBar';
import Breadcrumb from './../../components/Breadcrumb/Breadcrumb';

const styles = require('./PageFolderEntry.scss');

@connect(({folder, entry}) => ({
  folder: folder.get('folder'),
  entry: entry.get('entry')
}), {setSnackBarParams})
@injectF
@injectPush
@resolve(({dispatch, getState}, {params}) => {
  const promises = [];
  promises.push(dispatch(getFolder({id: params.folderId})));
  promises.push(dispatch(getEntry({id: params.entryId})));
  return Promise.all(promises);
})
export default class PageFolderEntry extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    setSnackBarParams: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  };

  goBack = () => {
    const {folder, push} = this.props;
    push(`/folders/${folder.id}/entries`);
  };

  goToFoldersPage = () => this.props.push('/');

  renderContentFields() {

    const {entry, f} = this.props;
    const keys = sortEntryKeys(Object.keys(entry.data));
    const rows = entryKeysToDataRows(keys, entry.data, f);

    return rows.map(({key, value, lang}) => {

      if (lang) {
        return (
          <tr key={`${key}-${lang}`}>
            <th>{f(`${key}-lang`, {lang: f(lang)})}</th>
            <td>{value}</td>
          </tr>
        );
      }

      return (
        <tr key={key}>
          <th>{f(key)}</th>
          <td>{value}</td>
        </tr>
      );
    });
  }

  render() {

    const {f, folder, entry} = this.props;

    return (
      <div className={c('page-info', styles.pageFolderEntry)}>
        <TopBar>
          <Breadcrumb>
            <FlatButton label={f('folders')} onTouchTap={this.goToFoldersPage} />
            <FlatButton label={f('folder-entries', {folderName: folder.name})} onTouchTap={this.goBack} />
            <span>{entry.sourceEntry}</span>
          </Breadcrumb>
          <FlatButton icon={<i className="fa fa-arrow-left" />}
            label={f('back')} primary onTouchTap={this.goBack} />
        </TopBar>
        <table className={styles.table}>
          <tbody>
            <tr>
              <th>{f('source-entry-lang', {lang: f(folder.data.sourceLanguage)})}</th>
              <td>{entry.sourceEntry}</td>
            </tr>
            {this.renderContentFields()}
          </tbody>
        </table>
      </div>
    );
  }
}
