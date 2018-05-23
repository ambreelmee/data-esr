import React, { Component } from 'react';
import {
  Button, Input, InputGroup, InputGroupAddon,
  Modal, ModalBody, ModalFooter, ModalHeader, Tooltip,
} from 'reactstrap';
import PropTypes from 'prop-types';

const triggerFileInputClick = () => {
  document.getElementById('import').click();
};

class UploadModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cancelTooltip: false,
      errorMessage: '',
      file: {},
      isLoading: false,
      modal: true,
      name: '',
    };

    this.removeFile = this.removeFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleCancelToolTip = this.toggleCancelToolTip.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  // Now only one the latest input is saved
  // could be improved by creating a temp array and check wether the names of the coming files are already in state, of not add them
  handleChange(event) {
    this.setState({
      file: event.target.files[0],
      name: event.target.files[0].name,
    });
  }

  removeFile() {
    this.setState({
      file: {},
      name: '',
      cancelTooltip: false,
    });
  }

  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.state.file);
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/import`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          this.setState({ isLoading: false });
          this.toggle();
        } else {
          this.setState({ errorMessage: "le fichier n'a pas pu être importé" });
        }
      });
  }

  toggleCancelToolTip() {
    this.setState({
      cancelTooltip: !this.state.cancelTooltip,
    });
  }

  toggle() {
    this.props.toggleModal();
    this.setState({
      modal: !this.state.modal,
    });
  }


  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}> Importer des données </ModalHeader>
        <ModalBody>
          <p>
            Vous pouvez importer directement des données en base à partir d&#39;un fichier <strong>csv</strong>.<br />
            Les en-têtes des colonnes doivent être identiques en ordre et en dénomination à celle du fichier
             d&#39;exemple disponible
            <a href={this.props.csvTemplate} download="template.csv"><strong> ici</strong></a>. <br />
          </p>

          <div className="position-relative">
            <Input
              id="import"
              type="file"
              style={{
                position: 'relative',
                textAlign: 'right',
                MozOpacity: 0,
                opacity: 0,
                zIndex: 2,
              }}
              onChange={this.handleChange}
            />
            <Button
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 3,
              }}
              color="success"
              className="m-1"
              onClick={triggerFileInputClick}
            >
              <i className="fa fa-file text-white ml-1" /> Choisir un fichier csv
            </Button>
            {this.state.name ?
              <InputGroup className="ml-1 mt-3" style={{ width: `${this.state.name.length + 9}ch` }}>
                <Input type="text" readOnly value={this.state.name} style={{ maxWidth: '250px' }} />
                <InputGroupAddon addonType="append">
                  <Button
                    id="cancel-upload-button"
                    color="transparent"
                    size="sm"
                    onClick={this.removeFile}
                  >
                    <i className="fa fa-close text-dark" />
                  </Button>
                  <Tooltip
                    isOpen={this.state.cancelTooltip}
                    target="cancel-upload-button"
                    toggle={this.toggleCancelToolTip}
                    placement="bottom"
                  >
                    Annuler les changements
                  </Tooltip>
                </InputGroupAddon>
              </InputGroup> : <div />}
            <p className="mt-3">
              <i className="fa fa-warning text-danger pr-1" />
              En cas de conflit avec les données actuellement enregistrées en base,
              les données importées écraseront les données en base sans avertissement supplémentaire,
              <strong>vérifier bien votre fichier avant de sauvegarder</strong>.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <p className="mt-2 text-danger">{this.state.errorMessage}</p>
          <Button
            className="m-1 float-right"
            color="primary"
            disabled={this.state.isLoading}
            onClick={!this.state.isLoading ? this.uploadFile : null}
          >
            {this.state.isLoading ?
              <div>
                <i className="fa fa-spinner fa-spin " />
                <span className="mx-1"> Chargement </span>
              </div> : <div>Mettre en base les données</div>}
          </Button>
          <Button color="secondary" onClick={this.toggle}>Annuler</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

UploadModal.propTypes = {
  csvTemplate: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default UploadModal;
