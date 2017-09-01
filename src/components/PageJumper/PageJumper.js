import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';

const styles = require('./PageJumper.scss');

export default class PageJumper extends Component {

  static propTypes = {
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onInputSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {inputValue: props.current};
  }

  handleInputChange = (event) => this.setState({'inputValue': event.target.value})

  handleSubmit = (event) => {
    event.preventDefault();
    const inputPageNum = parseInt(this.state.inputValue, 10);

    if (isNaN(inputPageNum)) {
      return;
    }
    this.props.onInputSubmit(inputPageNum);
  };

  render() {

    const {current, total} = this.props;
    const delta = 0.5;
    const padding = 1.2;
    const inputWidth = (this.state.inputValue.toString().length || 1) * delta + padding;

    return (
      <div className={styles.pageJumper}>
        <form onSubmit={this.handleSubmit}>
          <TextField name="page" type="number" style={{width: `${inputWidth}em`}} min={1} max={total} onChange={this.handleInputChange} defaultValue={current} />
          <span>&#47; {total}</span>
        </form>
      </div>
    );
  }
}
