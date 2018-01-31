import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

export default class FileUpload extends Component {

  static propTypes = {
    handleFileChange: PropTypes.func.isRequired
  };

  handleFile = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];

    if (!file) return;

    reader.onload = (img) => {
      ReactDom.findDOMNode(this.refs.in).value = '';
      this.props.handleFileChange(img.target.result);
    };
    reader.readAsDataURL(file);
  }

  render() {
    return (
      <input ref="in" type="file" accept="image/*" onChange={this.handleFile} />
    );
  }

}
