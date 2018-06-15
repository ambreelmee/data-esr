import React, { Component } from 'react';
import {
  InputGroup, InputGroupAddon, Input, Button, Tooltip, Modal,
  ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';


class Synonym extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cancelTooltip: false,
      content: this.props.content,
      deleteTooltip: false,
      displayEditButton: false,
      editTooltip: false,
      errorMessage: '',
      isDeleting: false,
      isEditing: false,
      modal: false,
    };
    this.cancelEdition = this.cancelEdition.bind(this);
    this.deleteSynonym = this.deleteSynonym.bind(this);
    this.onChange = this.onChange.bind(this);
    this.editSynonym = this.editSynonym.bind(this);
    this.toggleCancelToolTip = this.toggleCancelToolTip.bind(this);
    this.toggleDeleteToolTip = this.toggleDeleteToolTip.bind(this);
    this.toggleEditToolTip = this.toggleEditToolTip.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  onChange(event) {
    this.setState({
      displayEditButton: true,
      [event.target.id]: event.target.value,
    });
  }


  deleteSynonym() {
    this.setState({ isDeleting: true });
    const modifiedList = this.props.synonymsList;
    modifiedList.splice(this.props.index, 1);
    const synonym = modifiedList.join(', ');
    fetch(
      `${process.env.API_URL_STAGING}/institutions/${this.props.id}`,
      {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')})`,
        }),
        body: JSON.stringify({ institution: { synonym } }),
      },
    )
      .then((res) => {
        if (res.ok) {
          res.json().then(() => {
            this.setState({
              isDeleting: false,
            });
            this.props.getData(this.props.id);
          });
        } else {
          this.setState({
            errorMessage: 'impossible de supprimer le champ',
          });
        }
      });
  }

  editSynonym() {
    this.setState({ isEditing: true });
    const modifiedList = this.props.synonymsList;
    modifiedList[this.props.index] = this.state.content;
    const synonym = modifiedList.join(', ');
    fetch(
      `${process.env.API_URL_STAGING}/institutions/${this.props.id}`,
      {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')})`,
        }),
        body: JSON.stringify({ institution: { synonym } }),
      },
    )
      .then((res) => {
        if (res.ok) {
          res.json().then(() => {
            this.setState({
              isEditing: false,
            });
            this.props.getData(this.props.id);
          });
        } else {
          this.setState({
            errorMessage: 'impossible de modifier le champ',
          });
        }
      });
  }


  cancelEdition() {
    this.setState({
      displayEditButton: false,
      cancelTooltip: false,
      content: this.props.content,
    });
  }

  toggleDeleteToolTip() {
    this.setState({
      deleteTooltip: !this.state.deleteTooltip,
    });
  }

  toggleEditToolTip() {
    this.setState({
      editTooltip: !this.state.editTooltip,
    });
  }

  toggleCancelToolTip() {
    this.setState({
      cancelTooltip: !this.state.cancelTooltip,
    });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    return (
      <div>
        <p className="text-danger mb-0">{this.state.errorMessage}</p>
        <InputGroup className="mb-3">
          <Input
            id="content"
            type="text"
            value={this.state.content}
            onChange={this.onChange}
            placeholder={this.state.content}
          />
          {this.state.displayEditButton ?
            <InputGroupAddon addonType="append">
              <Button
                id={`synonym-edit-button-${this.props.index}`}
                color="transparent"
                size="sm"
                disabled={this.state.isEditing}
                onClick={this.editSynonym}
              >
                {this.state.isEditing ?
                  <i className="fa fa-spinner text-success fa-spin " /> :
                  <i className="fa fa-check text-success" />}
              </Button>
              <Tooltip
                isOpen={this.state.editTooltip}
                target={`synonym-edit-button-${this.props.index}`}
                toggle={this.toggleEditToolTip}
              >
                Sauvegarder les changements
              </Tooltip>
              <Button
                id={`cancel-button-${this.props.index}`}
                color="transparent"
                size="sm"
                onClick={this.cancelEdition}
              >
                <i className="fa fa-close text-dark" />
              </Button>
              <Tooltip
                isOpen={this.state.cancelTooltip}
                target={`cancel-button-${this.props.index}`}
                toggle={this.toggleCancelToolTip}
              >
                Annuler les changements
              </Tooltip>
            </InputGroupAddon> : <div />}
          <Button
            id={`delete-button-${this.props.id}`}
            color="danger"
            outline
            size="sm"
            onClick={this.toggleModal}
          >
            <i className="fa fa-close" />
          </Button>
          <Tooltip
            isOpen={this.state.deleteTooltip}
            target={`delete-button-${this.props.id}`}
            toggle={this.toggleDeleteToolTip}
          >
            Supprimer le nom d&#39;usage
          </Tooltip>
          <Modal isOpen={this.state.modal} toggle={this.toggleModal} color="danger">
            <ModalHeader toggle={this.toggleModal}>
              Suppression du champ
            </ModalHeader>
            <ModalBody>
              Etes-vous sûr de vouloir supprimer ce champ ?
            </ModalBody>
            <ModalFooter>
              <p className="mt-2 text-danger">{this.state.errorMessage}</p>
              <Button
                className="m-1 float-right"
                color="danger"
                disabled={this.state.isDeleting}
                onClick={!this.state.isDeleting ? this.deleteSynonym : null}
              >
                {this.state.isDeleting ?
                  <div>
                    <i className="fa fa-spinner fa-spin " />
                    <span className="mx-1"> Suppression </span>
                  </div> : <div />}
                Supprimer
              </Button>
              <Button color="secondary" onClick={this.toggleModal}>Annuler</Button>
            </ModalFooter>
          </Modal>
        </InputGroup>
      </div>
    );
  }
}

Synonym.propTypes = {
  content: PropTypes.string.isRequired,
  getData: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  synonymsList: PropTypes.array.isRequired,
};


export default Synonym;
