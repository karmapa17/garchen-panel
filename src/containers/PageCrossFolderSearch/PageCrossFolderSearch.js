import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import injectF from './../../helpers/injectF';
import injectPush from './../../helpers/injectPush';
import Heading from './../Heading/Heading';
import TopBar from './../../components/TopBar/TopBar';
import SearchBar from './../../components/SearchBar/SearchBar';
import {search} from './../../redux/modules/crossFolderSearch';
import Pagination from './../../components/Pagination/Pagination';

const styles = require('./PageCrossFolderSearch.scss');

@connect(({crossFolderSearch}) => ({
  total: crossFolderSearch.get('total'),
  perpage: crossFolderSearch.get('perpage'),
  folders: crossFolderSearch.get('folders')
}), {search})
@injectPush
@injectF
export default class PageCrossFolderSearch extends Component {

  static propTypes = {
    total: PropTypes.number.isRequired,
    push: PropTypes.func.isRequired,
    perpage: PropTypes.number.isRequired,
    search: PropTypes.func.isRequired,
    folders: PropTypes.array.isRequired,
    f: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      searchKeyword: '',
      page: 1
    };
  }

  componentWillUpdate(nextProps, nextState) {
    const {page, searchKeyword} = this.state;
    const {perpage, search} = this.props;

    const shouldSearch = (page !== nextState.page) || (perpage !== nextProps.perpage) ||
      (searchKeyword !== nextState.searchKeyword);

    if (shouldSearch) {

      search({
        page: nextState.page,
        perpage: nextProps.perpage,
        searchKeyword: nextState.searchKeyword.trim()
      });
    }
  }

  goToFoldersPage = () => this.props.push('/');

  handleClearSearchButtonTouchTap = () => {
    this.setState({searchKeyword: ''});
    this.refs.searchBar.getWrappedInstance().getWrappedInstance().clear();
  };

  handleSearchInputChange = (searchKeyword) => {
    if (this.state.searchKeyword !== searchKeyword) {
      this.setState({page: 1});
    }
    this.setState({searchKeyword});
  };

  handleFolderAnchorTouchTap = (folderId) => {
    return () => this.props.push(`/folders/${folderId}/entries`);
  };

  handleEntryAnchorTouchTap = (entry) => {
    return () => this.props.push(`/folders/${entry.folderId}/entries/${entry.id}`);
  };

  renderEntries(entries) {
    const rows = entries.map((entry) => {
      return (
        <li key={`entry-row-${entry.id}`}>
          <a onTouchTap={this.handleEntryAnchorTouchTap(entry)}>{entry.sourceEntry}</a>
        </li>
      );
    });
    return <ul className={styles.entryBox}>{rows}</ul>;
  }

  renderFolders() {
    const rows = this.props.folders.map(({id, name, entries}) => {
      return (
        <div key={`folder-row-${id}`} className={styles.folder}>
          <a onTouchTap={this.handleFolderAnchorTouchTap(id)}>{name}</a>
          {this.renderEntries(entries)}
        </div>
      );
    });
    return <div className={styles.folderBox}>{rows}</div>;
  }

  handlePageButtonTouchTap = (page) => {
    this.setState({page});
  };

  render() {
    const {searchKeyword, page} = this.state;
    const {f, total, perpage} = this.props;

    return (
      <div className={styles.pageCrossFolderSearch}>
        <TopBar>
          <Heading>{f('cross-folder-search')}</Heading>
          <FlatButton icon={<CloseIcon />} onTouchTap={this.goToFoldersPage} />
        </TopBar>
        <SearchBar ref="searchBar" onInputChange={this.handleSearchInputChange}
          searchKeyword={searchKeyword} matchedCount={total} autoFocus
          onClearFilterButtonTouchTap={this.handleClearSearchButtonTouchTap} />
        {this.renderFolders()}
        {(total > perpage) && <Pagination current={page} total={Math.ceil(total / perpage)}
          onButtonTouchTap={this.handlePageButtonTouchTap} />}
      </div>
    );
  }
}
