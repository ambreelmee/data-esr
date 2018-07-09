import React, { Component } from 'react';
import { Button, Tooltip } from 'reactstrap';
import NameModal from './Name/NameModal';
import UploadModal from './UploadModal';

class AddInstitutionButtons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addModal: false,
      addTooltip: false,
      uploadButton: false,
      uploadModal: false,
      uploadTooltip: false,
    };
    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleAddTooltip = this.toggleAddTooltip.bind(this);
    this.toggleUploadModal = this.toggleUploadModal.bind(this);
    this.toggleUploadTooltip = this.toggleUploadTooltip.bind(this);
  }

  toggleAddModal() {
    this.setState({ addModal: !this.state.addModal });
  }

  toggleAddTooltip() {
    this.setState({ addTooltip: !this.state.addTooltip });
  }

  toggleUploadModal() {
    this.setState({ uploadModal: !this.state.uploadModal });
  }

  toggleUploadTooltip() {
    this.setState({ uploadTooltip: !this.state.uploadTooltip });
  }

  mouseEnter() {
    this.setState({ uploadButton: true });
  }

  mouseLeave() {
    this.setState({ uploadButton: false });
  }

  render() {
    return (
      <div
        className="floating"
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
      >
        <Button
          className="float-add"
          color="primary"
          id="search-page-add-button"
          onClick={this.toggleAddModal}
          type="button"
        >
          <i id="icon-plus" className="fa fa-plus my-float" />
        </Button>
        <Tooltip
          isOpen={this.state.addTooltip}
          target="search-page-add-button"
          toggle={this.toggleAddTooltip}
          placement="left"
        >
        Ajouter un établissement
        </Tooltip>
        {this.state.addModal ?
          <NameModal toggleModal={this.toggleAddModal} /> : <div />}
        {this.state.uploadButton ?
          <div>
            <Button
              className="float-upload"
              color="success"
              id="search-page-upload-button"
              type="button"
              onClick={this.toggleUploadModal}
            >
              <i className="fa fa-upload" />
            </Button>
            <Tooltip
              isOpen={this.state.uploadTooltip}
              target="search-page-upload-button"
              toggle={this.toggleUploadTooltip}
              delay={{ show: 100, hide: 0 }}
              placement="left"
            >
            Importer des établissements
            </Tooltip>
          </div> : <div />}
        {this.state.uploadModal ?
          <UploadModal
            name="etablissements"
            toggleModal={this.toggleUploadModal}
            url={`${process.env.API_URL_STAGING}institutions/import`}
          /> : <div />}
      </div>
    );
  }
}

export default AddInstitutionButtons;
