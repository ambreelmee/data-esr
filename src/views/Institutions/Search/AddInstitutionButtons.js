import React, { Component } from 'react';
import { Button, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import AddInstitutionModal from './AddInstitutionModal';
import UploadModal from '../UploadModal';

class AddInstitutionButtons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addTooltip: false,
      uploadButton: false,
      uploadModal: false,
      uploadTooltip: false,
    };
    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.toggleAddTooltip = this.toggleAddTooltip.bind(this);
    this.toggleUploadModal = this.toggleUploadModal.bind(this);
    this.toggleUploadTooltip = this.toggleUploadTooltip.bind(this);
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
          color="info"
          id="search-page-add-button"
          onClick={this.props.toggleModal}
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
        {this.props.modal ?
          <AddInstitutionModal
            createInstitution={this.props.createInstitution}
            hasErrored={this.props.hasErrored}
            isLoading={this.props.isLoading}
            modal={this.props.modal}
            toggleModal={this.props.toggleModal}
          /> : <div />}
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

AddInstitutionButtons.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  createInstitution: PropTypes.func.isRequired,
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  modal: PropTypes.bool.isRequired,
};

export default AddInstitutionButtons;
