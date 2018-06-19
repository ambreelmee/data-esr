import React, { Component } from 'react';
import { Button, InputGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';


class CategoryModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      modal: true,
      errorMessage: '',
      isLoading: false,
    };
    this.addCategory = this.addCategory.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  onKeyPress(event) {
    if (event.key === 'Enter') {
      this.addCategory();
    }
  }

  addCategory() {
    this.setState({ isLoading: true });
    const newCategory = {};
    newCategory[`${this.props.categoryType}_category`] = {
      title: this.state.title,
    };
    fetch(`${process.env.API_URL_STAGING}${this.props.categoryType}_categories`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify(newCategory),
    })
      .then((res) => {
        if (res.ok) {
          this.setState({ modal: false });
          this.props.getCategories(this.props.categoryType);
        } else {
          this.setState({
            errorMessage: 'Formulaire vide ou incomplet',
            isLoading: false,
          });
        }
      });
  }


  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.props.toggleModal}>
        <ModalHeader toggle={this.props.toggleModal}>
          Ajouter une catégorie
        </ModalHeader>
        <ModalBody>
          <InputGroup className="mb-3">
            <Input
              id="title"
              type="text"
              value={this.state.title}
              onChange={this.onChange}
              placeholder="Nom de la catégorie"
              onKeyPress={this.onKeyPress}
            />
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <p className="mt-2 text-danger">{this.state.errorMessage}</p>
          <Button
            className="m-1 float-right"
            color="primary"
            disabled={this.state.isLoading}
            onClick={!this.state.isLoading ? this.addCategory : null}
          >
            {this.state.isLoading ?
              <div>
                <i className="fa fa-spinner fa-spin " />
                <span className="mx-1"> Ajout </span>
              </div> : <div>Ajouter une catégorie</div>}
          </Button>
          <Button color="secondary" onClick={this.props.toggleModal}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

CategoryModal.propTypes = {
  categoryType: PropTypes.string.isRequired,
  getCategories: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};


export default CategoryModal;
