import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';

import {map} from 'lodash';
import {loadFolder} from './../../redux/modules/folder';
import {loadEntry} from './../../redux/modules/entry';
import {setSnackBarParams} from './../../redux/modules/main';
import injectF from './../../helpers/injectF';
import resolve from './../../helpers/resolve';
import injectPush from './../../helpers/injectPush';
import sortEntryKeys from './../../helpers/sortEntryKeys';

import SECT_VALUES from './../../constants/sectValues';
import CATEGORY_VALUES from './../../constants/categoryValues';

const styles = require('./PageFolderEntry.scss');

@connect(({folder, entry}) => ({
  folder: folder.get('folder'),
  entry: entry.get('entry')
}), {setSnackBarParams})
@injectF
@injectPush
@resolve(({dispatch, getState}, {params}) => {
  const promises = [];
  promises.push(dispatch(loadFolder({id: params.folderId})));
  promises.push(dispatch(loadEntry({id: params.entryId})));
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

    return map(keys, (key) => {

      const value = entry.data[key];
      const matchTargetLanguage = key.match(/^targetEntry-(.+)$/);

      if (matchTargetLanguage) {
        const lang = matchTargetLanguage[1];

        return (
          <tr key={`target-entry-${lang}`}>
            <th>{f('target-entry-lang', {lang: f(lang)})}</th>
            <td>{value}</td>
          </tr>
        );
      }

      const matchExplaination = key.match(/^explaination-(.+)$/);

      if (matchExplaination) {
        const lang = matchExplaination[1];

        return (
          <tr key={`explaination-${lang}`}>
            <th>{f('explaination-lang', {lang: f(lang)})}</th>
            <td>{value}</td>
          </tr>
        );
      }

      const matchOriginal = key.match(/^original-(.+)$/);

      if (matchOriginal) {
        const lang = matchOriginal[1];

        return (
          <tr key={`original-${lang}`}>
            <th>{f('original-lang', {lang: f(lang)})}</th>
            <td>{value}</td>
          </tr>
        );
      }

      const matchSource = key.match(/^source-(.+)$/);

      if (matchSource) {
        const lang = matchSource[1];

        return (
          <tr key={`source-${lang}`}>
            <th>{f('source-lang', {lang: f(lang)})}</th>
            <td>{value}</td>
          </tr>
        );
      }

      if ('category' === key) {
        return (
          <tr key={key}>
            <th>{f(key)}</th>
            <td>{f(CATEGORY_VALUES.find((row) => row.value === value).id)}</td>
          </tr>
        );
      }

      if ('sect' === key) {
        return (
          <tr key={key}>
            <th>{f(key)}</th>
            <td>{f(SECT_VALUES.find((row) => row.value === value).id)}</td>
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
        <div className="topbar">
          <ul className="breadcrumb">
            <li>
              <FlatButton label={f('folders')} onTouchTap={this.goToFoldersPage} />
            </li>
            <li>
              <FlatButton label={f('folder-entries', {folderName: folder.name})} onTouchTap={this.goBack} />
            </li>
            <li>
              <span>{entry.sourceEntry}</span>
            </li>
          </ul>
          <FlatButton icon={<i className="fa fa-arrow-left" />}
            label={f('back')} primary onTouchTap={this.goBack} />
        </div>
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
