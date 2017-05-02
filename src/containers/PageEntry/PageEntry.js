import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';

import {getFolder} from './../../redux/modules/folder';
import {getEntry, updateEntry} from './../../redux/modules/entry';
import {setSnackBarParams} from './../../redux/modules/ui';
import injectF from './../../helpers/injectF';
import resolve from './../../helpers/resolve';
import injectPush from './../../helpers/injectPush';
import sortEntryKeys from './../../helpers/sortEntryKeys';
import entryKeysToDataRows from './../../helpers/entryKeysToDataRows';
import TopBar from './../../components/TopBar/TopBar';
import Breadcrumb from './../../components/Breadcrumb/Breadcrumb';
import EditEntryForm from './../../components/EditEntryForm/EditEntryForm';
import EXPLAINATION_CATEGORY_VALUES from './../../constants/explainationCategoryValues';

const styles = require('./PageEntry.scss');

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
export default class PageEntry extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    folder: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    setSnackBarParams: PropTypes.func.isRequired,
    updateEntry: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {isEditMode: false};
  }

  goBack = () => {
    const {folder, push} = this.props;
    push(`/folders/${folder.id}/entries`);
  };

  goToFoldersPage = () => this.props.push('/');

  renderContentFields() {

    const {entry, f} = this.props;

    const entryData = entry.data;
    const keys = sortEntryKeys(Object.keys(entryData));
    const rows = entryKeysToDataRows(keys, entryData, f);
    const skipCols = ['explaination-source', 'explaination-note', 'explaination-category'];

    return rows.map(({key, value, lang}) => {

      if ('explaination' === key) {

        const sourceArr = entryData[`explaination-source-${lang}`] || [];
        const noteArr = entryData[`explaination-note-${lang}`] || [];
        const categoryArr = entryData[`explaination-category-${lang}`] || [];

        return value.map((v, index) => {

          const nodes = [];

          nodes.push((
            <tr key={`${key}-${lang}-${index}`}>
              <th>{f(`${key}-num-lang`, {lang: f(lang), num: (index + 1)})}</th>
              <td>{v}</td>
            </tr>
          ));

          const sourceValue = sourceArr[index];

          if (sourceValue) {
            nodes.push((
              <tr key={`explaination-source-${lang}-${index}`}>
                <th>{f(`explaination-source-num-lang`, {lang: f(lang), num: (index + 1)})}</th>
                <td>{sourceValue}</td>
              </tr>
            ));
          }

          const noteValue = noteArr[index];

          if (noteValue) {
            nodes.push((
              <tr key={`explaination-note-${lang}-${index}`}>
                <th>{f(`explaination-note-num-lang`, {lang: f(lang), num: (index + 1)})}</th>
                <td>{noteValue}</td>
              </tr>
            ));
          }

          const categoryValue = categoryArr[index];

          if (categoryValue) {
            const categoryId = EXPLAINATION_CATEGORY_VALUES.find((row) => row.value === categoryValue).id;
            nodes.push((
              <tr key={`explaination-category-${lang}-${index}`}>
                <th>{f(`explaination-category-num-lang`, {lang: f(lang), num: (index + 1)})}</th>
                <td>{f(categoryId)}</td>
              </tr>
            ));
          }

          return nodes;
        });
      }

      if (skipCols.includes(key)) {
        return false;
      }

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

  goToEditPage = () => {
    const {push, folder, entry} = this.props;
    push(`/folders/${folder.id}/entries/${entry.id}/edit`);
  };

  handleSubmit = async (data) => {
    const {entry, updateEntry, setSnackBarParams, f} = this.props;
    await updateEntry({
      id: entry.id,
      data
    });
    setSnackBarParams(true, f('folder-entry-has-been-updated', {sourceEntry: data.sourceEntry}));
    this.setState({isEditMode: false});
  };

  setEditMode = () => this.setState({isEditMode: true});

  renderContent() {

    const {isEditMode} = this.state;
    const {f, folder, entry} = this.props;

    const initialValues = {
      entryId: entry.id,
      folderId: folder.id,
      sourceEntry: entry.sourceEntry,
      ...entry.data
    };

    if (isEditMode) {
      return <EditEntryForm ref="editEntryForm" onSubmit={this.handleSubmit} folder={folder} initialValues={initialValues} />;
    }

    return (
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>{f('source-entry-lang', {lang: f(folder.data.sourceLanguage)})}</th>
            <td>{entry.sourceEntry}</td>
          </tr>
          {this.renderContentFields()}
        </tbody>
      </table>
    );
  }

  cancelEdit = () => this.setState({isEditMode: false});

  render() {

    const {isEditMode} = this.state;
    const {f, folder, entry} = this.props;

    return (
      <div className={c('page-info', styles.pageFolderEntry)}>
        <TopBar>
          <Breadcrumb>
            <Link to="/">{f('folders')}</Link>
            <Link to={`/folders/${folder.id}/entries`}>{f('folder-entries', {folderName: folder.name})}</Link>
            <span>{entry.sourceEntry}</span>
          </Breadcrumb>
          <div>

           {isEditMode && <FlatButton icon={<i className="fa fa-ban" />}
              label={f('cancel')} primary onTouchTap={this.cancelEdit} />}

           {(! isEditMode) && <FlatButton icon={<i className="fa fa-pencil" />}
              label={f('edit')} primary onTouchTap={this.setEditMode} />}

            <FlatButton icon={<i className="fa fa-arrow-left" />}
              label={f('back')} primary onTouchTap={this.goBack} />
          </div>
        </TopBar>
        <div className={styles.content}>{this.renderContent()}</div>
      </div>
    );
  }
}
