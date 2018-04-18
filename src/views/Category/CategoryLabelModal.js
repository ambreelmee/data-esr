import React, { Component } from 'react';
import { Button, Col, InputGroup,  Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';


class CategoryLabelModal extends Component {
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
    this.toggle = this.toggle.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  toggle() {
    this.props.toggleModal('institution_categoryModal');
    this.setState({
      modal: !this.state.modal,
      errorMessage: '',
    });
  }

  addCategory() {
    this.setState({ isLoading: true });
    const newCategory = {
      short_label: this.state.shortLabel,
      long_label: this.state.longLabel,
    }
    fetch(`${process.env.API_URL_STAGING}institution_category_labels`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({ institution_category_label : newCategory}),
    })
      .then(res => res.json())
      .then((data) => {
        if (data === 'Record not found') {
          this.setState({
            errorMessage: 'Formulaire vide ou incomplet',
            isLoading: false,
          });
        } else {
          this.toggle();
          this.setState({ isLoading: false });
          this.props.getCategories('institution_category_labels');
        }
      });
  }


  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          Ajouter une catégorie
        </ModalHeader>
        <ModalBody>
          <InputGroup className="mb-3">
            <Col xs="4">
              <Input
                id="shortLabel"
                type="text"
                value={this.state.shortLabel}
                onChange={this.onChange}
                placeholder="Nom court"
              />
            </Col>
            <Col xs="8">
              <Input
                id="longLabel"
                type="text"
                value={this.state.longLabel}
                onChange={this.onChange}
                placeholder="Nom complet*"
              />
            </Col>
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
              </div> : <div>Ajouter une catégorie </div>}
          </Button>
          <Button color="secondary" onClick={this.toggle}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

CategoryLabelModal.propTypes = {
  getCategories: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};


export default CategoryLabelModal;
