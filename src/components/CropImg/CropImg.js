import React, {Component, PropTypes} from 'react';
import AvatarCropper from 'react-avatar-cropper';

import FileUpload from './FileUpload';

const styles = require('./CropImg.scss');

export default class CropImg extends Component {

  static propTypes = {
    input: PropTypes.any.isRequired,
    coverPic: PropTypes.string
  };

  state = {
    cropperOpen: false,
    img: null,
    croppedImg: this.props.coverPic
  };

  handleFileChange = (dataURI) => {
    this.setState({
      img: dataURI,
      croppedImg: this.state.croppedImg,
      cropperOpen: true
    });
  }

  handleCrop = (dataURI) => {
    const {input: {onChange}} = this.props;
    this.setState({
      cropperOpen: false,
      img: null,
      croppedImg: dataURI
    });
    onChange(dataURI);
  }

  handleRequestHide = () => {
    this.setState({
      cropperOpen: false
    });
  }

  handleRemoveCover = () => {
    this.handleRequestHide();
    this.handleCrop('');
  }

  render() {
    return (
      <div>
        <div className={styles.avatarPhoto}>
          <FileUpload handleFileChange={this.handleFileChange} />
          <div className="avatar-edit">
            <span>Click to Pick Avatar</span>
            <i className="fa fa-camera"></i>
          </div>
          <img src={this.state.croppedImg} />
        </div>
        <button className={styles.removeBtn} onClick={this.handleRemoveCover}>Remove Cover</button>
        {this.state.cropperOpen &&
          <AvatarCropper
            onRequestHide={this.handleRequestHide}
            cropperOpen={this.state.cropperOpen}
            onCrop={this.handleCrop}
            image={this.state.img}
            width={400}
            height={400}
          />
        }
      </div>
    );
  }

}
