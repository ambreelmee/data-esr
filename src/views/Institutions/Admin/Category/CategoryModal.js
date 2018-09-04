import React, { Component } from 'react';
import { Button, Col, InputGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import PropTypes from 'prop-types';


class CategoryModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      origin: '',
      modal: true,
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
    const newCategory = {};
    newCategory[`${this.props.categoryType}_category`] = {
      title: this.state.title,
      origin: this.state.origin,
    };
    const url = `${process.env.API_URL_STAGING}${this.props.categoryType}_categories`;
    this.props.addContent(url, JSON.stringify(newCategory), 'POST');
  }


  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.props.toggleModal}>
        <ModalHeader toggle={this.props.toggleModal}>
          Ajouter une catégorie
        </ModalHeader>
        <ModalBody>
          <Row>
            {this.props.categoryType === 'institution_tag' ?
              <Col xs="4">
                <Input
                  id="origin"
                  type="text"
                  value={this.state.origin}
                  onChange={this.onChange}
                  placeholder="Source"
                />
              </Col> : ''}
            <Col>
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
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <p className="mt-2 text-danger">
            {this.props.hasErrored ? "une erreur est survenue lors de l'envoi du formulaire" : ''}
          </p>
          <Button
            className="m-1 float-right"
            color="primary"
            disabled={this.props.isLoading}
            onClick={!this.props.isLoading ? this.addCategory : null}
          >
            {this.props.isLoading ?
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
  addContent: PropTypes.func.isRequired,
  categoryType: PropTypes.string.isRequired,
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};


export default CategoryModal;
