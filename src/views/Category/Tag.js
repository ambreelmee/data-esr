import React, { Component } from 'react';
import {
  Button, Col, Input, InputGroup, InputGroupAddon, Modal, ModalBody,
  ModalHeader, ModalFooter, Tooltip,
} from 'reactstrap';
import PropTypes from 'prop-types';

class CategoryTag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cancelTooltip: false,
      deleteTooltip: false,
      displayEditButton: false,
      editTooltip: false,
      isDeleting: false,
      isEditing: false,
      longLabel: this.props.longLabel,
      modal: false,
      shortLabel: this.props.shortLabel,
    };
    this.cancelEdition = this.cancelEdition.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.onChange = this.onChange.bind(this);
    this.modifyCurrentCategory = this.modifyCurrentCategory.bind(this);
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


  deleteCategory() {
    this.setState({ isDeleting: true });
    fetch(
      `${process.env.API_URL_STAGING}/institution_tag/${this.props.id}`,
      {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')})`,
        }),
      },
    )
      .then(res => res.json())
      .then(() => {
        this.setState({
          isDeleting: false,
        });
        this.props.getTag();
      });
  }

  modifyCurrentCategory() {
    this.setState({ isEditing: true });
    const institution_tag = {
      id: this.props.id,
      long_label: this.state.longLabel,
      short_label: this.state.shortLabel,
    };
    fetch(
      `${process.env.API_URL_STAGING}/institution_tags/${this.props.id}`,
      {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
        body: JSON.stringify({ institution_tag }),
      },
    )
      .then(res => res.json())
      .then((data) => {
        this.setState({
          isEditing: false,
          displayEditButton: false,
          editTooltip: false,
          longLabel: data.longLabel,
          shortLabel: data.shortLabel,
        });
      });
  }

  cancelEdition() {
    this.setState({
      displayEditButton: false,
      longLabel: this.props.longLabel,
      shortLabel: this.props.shortLabel,
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
      <InputGroup className="mb-3">
        <Col xs="4" className="pr-0">
          <Input
            id="shortLabel"
            type="text"
            value={this.state.shortLabel}
            onChange={this.onChange}
            placeholder={this.state.shortLabel}
          />
        </Col>
        <Col xs="8" className="pl-0">
          <InputGroup>
            <Input
              id="longLabel"
              type="text"
              value={this.state.longLabel}
              onChange={this.onChange}
              placeholder={this.state.longLabel}
            />
            {this.state.displayEditButton ?
              <InputGroupAddon addonType="append">
                <Button
                  id={`labels-edit-button-${this.props.id}`}
                  color="transparent"
                  size="sm"
                  disabled={this.state.isEditing}
                  onClick={this.modifyCurrentCategory}
                >
                  {this.state.isEditing ?
                    <i className="fa fa-spinner text-success fa-spin " /> :
                    <i className="fa fa-check text-success" />}
                </Button>
                <Tooltip
                  isOpen={this.state.editTooltip}
                  target={`labels-edit-button-${this.props.id}`}
                  toggle={this.toggleEditToolTip}
                >
                  Modifier l&#39;intitulé de la catégorie
                </Tooltip>
                <Button
                  id={`labels-cancel-button-${this.props.id}`}
                  color="transparent"
                  size="sm"
                  onClick={this.cancelEdition}
                >
                  <i className="fa fa-close text-dark" />
                </Button>
                <Tooltip
                  isOpen={this.state.cancelTooltip}
                  target={`labels-cancel-button-${this.props.id}`}
                  toggle={this.toggleCancelToolTip}
                >
                  Annuler les changements
                </Tooltip>
              </InputGroupAddon> : <div />}
            <Button
              id={`labels-delete-button-${this.props.id}`}
              color="danger"
              outline
              size="sm"
              onClick={this.toggleModal}
            >
              <i className="fa fa-close" />
            </Button>
            <Tooltip
              isOpen={this.state.deleteTooltip}
              target={`labels-delete-button-${this.props.id}`}
              toggle={this.toggleDeleteToolTip}
            >
              Supprimer la catégorie
            </Tooltip>
            <Modal isOpen={this.state.modal} toggle={this.toggleModal} color="danger">
              <ModalHeader toggle={this.toggleModal}>
                Suppression du champ
              </ModalHeader>
              <ModalBody>
                <i className="fa fa-warning text-danger pr-1" />
                Attention! Toutes les données liées à la catégorie seront perdues.<br />
                Etes-vous sûr de vouloir supprimer ce champ ?
              </ModalBody>
              <ModalFooter>
                <p className="mt-2 text-danger">{this.state.errorMessage}</p>
                <Button
                  className="m-1 float-right"
                  color="danger"
                  disabled={this.state.isDeleting}
                  onClick={!this.state.isDeleting ? this.deleteCategory : null}
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
        </Col>
      </InputGroup>
    );
  }
}

CategoryTag.propTypes = {
  getTag: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  longLabel: PropTypes.string.isRequired,
  shortLabel: PropTypes.string,
};

CategoryTag.defaultProps = {
  shortLabel: '',
}


export default CategoryTag;
