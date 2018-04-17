import React, { Component } from 'react';
import {
  Button, Input, InputGroup, InputGroupAddon, Modal, ModalBody,
  ModalHeader, ModalFooter, Tooltip,
} from 'reactstrap';
import PropTypes from 'prop-types';

class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cancelTooltip: false,
      title: this.props.title,
      deleteTooltip: false,
      displayEditButton: false,
      editTooltip: false,
      isDeleting: false,
      isEditing: false,
      modal: false,
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
      `${process.env.API_URL_STAGING}/${this.props.categoryType}_categories/${this.props.id}`,
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
        this.props.getCategories();
      });
  }

  modifyCurrentCategory() {
    this.setState({ isEditing: true });
    const modifiedCategory = {}
    modifiedCategory[`${this.props.categoryType}_category`] = {
      id: this.props.id,
      title: this.state.title,
    };
    fetch(
      `${process.env.API_URL_STAGING}/${this.props.categoryType}_categories/${this.props.id}`,
      {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
        body: JSON.stringify(modifiedCategory),
      },
    )
      .then(res => res.json())
      .then((data) => {
        this.setState({
          isEditing: false,
          title: data.title,
          displayEditButton: false,
          editTooltip: false,
        });
      });
  }

  cancelEdition() {
    this.setState({
      displayEditButton: false,
      title: this.props.title,
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
        <Input
          id="title"
          type="text"
          value={this.state.title}
          onChange={this.onChange}
          placeholder={this.state.title}
        />
        {this.state.displayEditButton ?
          <InputGroupAddon addonType="append">
            <Button
              id={`${this.props.categoryType}-edit-button-${this.props.id}`}
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
              target={`${this.props.categoryType}-edit-button-${this.props.id}`}
              toggle={this.toggleEditToolTip}
            >
              Modifier l&#39;intitulé de la catégorie
            </Tooltip>
            <Button
              id={`${this.props.categoryType}-cancel-button-${this.props.id}`}
              color="transparent"
              size="sm"
              onClick={this.cancelEdition}
            >
              <i className="fa fa-close text-dark" />
            </Button>
            <Tooltip
              isOpen={this.state.cancelTooltip}
              target={`${this.props.categoryType}-cancel-button-${this.props.id}`}
              toggle={this.toggleCancelToolTip}
            >
              Annuler les changements
            </Tooltip>
          </InputGroupAddon> : <div />}
        <Button
          id={`${this.props.categoryType}-delete-button-${this.props.id}`}
          color="danger"
          outline
          size="sm"
          onClick={this.toggleModal}
        >
          <i className="fa fa-close" />
        </Button>
        <Tooltip
          isOpen={this.state.deleteTooltip}
          target={`${this.props.categoryType}-delete-button-${this.props.id}`}
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
    );
  }
}

Category.propTypes = {
  categoryType: PropTypes.string.isRequired,
  getCategories: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};


export default Category;
