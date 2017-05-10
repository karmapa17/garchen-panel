import React, {Component, PropTypes} from 'react';
import {debounce} from 'lodash';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

import injectF from './../../helpers/injectF';

const styles = require('./LocalSearchBar.scss');

@injectF
export default class LocalSearchBar extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    selectedSearchType: PropTypes.string,
    searchTypes: PropTypes.array,
    onInputChange: PropTypes.func.isRequired,
    onSearchTypeChange: PropTypes.func
  };

  static defaultProps = {
    searchTypes: []
  };

  debouncedInputChange = debounce((event) => {
    this.props.onInputChange(event.target.value);
  }, 1000);

  handleInputChange = (event) => {
    event.persist();
    this.debouncedInputChange(event);
  };

  renderSearchTypes() {

    const {f, searchTypes, selectedSearchType, onSearchTypeChange} = this.props;

    if (0 === searchTypes.length) {
      return false;
    }
    const items = searchTypes.map((type) => {
      return <MenuItem value={type} key={`search-menu-item-${type}`} primaryText={f(type)} />;
    });
    return <SelectField value={selectedSearchType} onChange={onSearchTypeChange} style={{width: 160}}>{items}</SelectField>;
  }

  render() {
    const {f} = this.props;
    return (
      <div className={styles.localSearchBar}>
        <TextField className={styles.searchInput} hintText={f('search-entries')} onChange={this.handleInputChange} />
        {this.renderSearchTypes()}
      </div>
    );
  }
}
