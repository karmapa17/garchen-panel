import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import bindAppHistory from './../../utils/bindAppHistory';
import CircularProgress from 'material-ui/CircularProgress';
import injectF from './../../utils/injectF';
import injectPush from './../../utils/injectPush';
import TopBar from './../../components/TopBar/TopBar';
import SearchBar from './../../components/SearchBar/SearchBar';
import {search} from './../../redux/modules/crossFolderSearch';
import {setCachePageCrossFolderSearch} from './../../redux/modules/cache';
import Pagination from './../../components/Pagination/Pagination';

const styles = require('./PageCrossFolderSearch.scss');

@connect(({crossFolderSearch, cache}) => ({
  isSearching: crossFolderSearch.get('isSearching'),
  cache: cache.get('cachePageCrossFolderSearch'),
  total: crossFolderSearch.get('total'),
  perpage: crossFolderSearch.get('perpage'),
  folders: crossFolderSearch.get('folders')
}), {search, setCachePageCrossFolderSearch})
@injectPush
@injectF
@bindAppHistory
export default class PageCrossFolderSearch extends Component {

  static propTypes = {
    total: PropTypes.number.isRequired,
    push: PropTypes.func.isRequired,
    perpage: PropTypes.number.isRequired,
    cache: PropTypes.object.isRequired,
    search: PropTypes.func.isRequired,
    isSearching: PropTypes.bool.isRequired,
    setCachePageCrossFolderSearch: PropTypes.func.isRequired,
    folders: PropTypes.array.isRequired,
    f: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = Object.assign({
      searchKeyword: '',
      page: 1
    }, props.cache);
  }

  componentWillMount() {

    const {page, searchKeyword} = this.state;
    const {perpage, search} = this.props;

    search({
      page,
      perpage,
      searchKeyword: searchKeyword.trim()
    });
  }

  componentWillUpdate(nextProps, nextState) {
    const {page, searchKeyword} = this.state;
    const {perpage, search, setCachePageCrossFolderSearch} = this.props;

    const nextPage = nextState.page;
    const nextPerpage = nextProps.perpage;
    const nextSearchKeyword = nextState.searchKeyword;

    const shouldSearch = (page !== nextPage) || (perpage !== nextPerpage) ||
      (searchKeyword !== nextSearchKeyword);

    if (shouldSearch) {

      setCachePageCrossFolderSearch({
        page: nextPage,
        searchKeyword: nextSearchKeyword
      });

      search({
        page: nextPage,
        perpage: nextPerpage,
        searchKeyword: nextSearchKeyword.trim()
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
    const {page} = this.state;
    const {total, perpage, isSearching} = this.props;

    if (isSearching) {
      return (
        <CircularProgress mode="indeterminate" size={80}
          style={{textAlign: 'center', marginTop: '80px', marginRight: 'auto', marginLeft: 'auto', display: 'block'}} />
      );
    }

    const rows = this.props.folders.map(({id, name, entries}) => {
      return (
        <div key={`folder-row-${id}`} className={styles.folder}>
          <a onTouchTap={this.handleFolderAnchorTouchTap(id)}>{name}</a>
          {this.renderEntries(entries)}
        </div>
      );
    });

    return (
      <div>
        <div className={styles.folderBox}>{rows}</div>
        {(total > perpage) && <Pagination current={page} total={Math.ceil(total / perpage)}
          onButtonTouchTap={this.handlePageButtonTouchTap} />}
      </div>
    );
  }

  handlePageButtonTouchTap = (page) => {
    this.setState({page});
  };

  render() {
    const {searchKeyword} = this.state;
    const {f, total, isSearching} = this.props;

    return (
      <div className={styles.pageCrossFolderSearch}>
        <TopBar>
          <h2>{f('cross-folder-search')}</h2>
          <FlatButton icon={<CloseIcon />} onTouchTap={this.goToFoldersPage} />
        </TopBar>
        <SearchBar ref="searchBar" onInputChange={this.handleSearchInputChange} isLoading={isSearching}
          searchKeyword={searchKeyword} matchedCount={total} autoFocus
          onClearFilterButtonTouchTap={this.handleClearSearchButtonTouchTap} />
        {this.renderFolders()}
      </div>
    );
  }
}
