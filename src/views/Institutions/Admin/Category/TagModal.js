import React, { Component } from 'react';
import { Button, Col, InputGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';


class TagModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      longLabel: '',
      shortLabel: '',
    };
    this.addCategory = this.addCategory.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }


  addCategory() {
    const url = `${process.env.API_URL_STAGING}institution_tags`;
    const institution_tag = {
      short_label: this.state.shortLabel,
      long_label: this.state.longLabel,
      institution_tag_category_id: this.props.categoryId,
    };
    this.props.addContent(url, JSON.stringify({ institution_tag }), 'POST');
  }


  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggleModal}>
        <ModalHeader toggle={this.props.toggleModal}>
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
          <p className="mt-2 text-danger">
            {this.props.hasErrored ? "Une erreur est survenue lors de l'envoi du formulaire" : ''}
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
              </div> : <div>Ajouter une catégorie </div>}
          </Button>
          <Button color="secondary" onClick={this.props.toggleModal}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

TagModal.propTypes = {
  addContent: PropTypes.func.isRequired,
  categoryId: PropTypes.number.isRequired,
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  modal: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};


export default TagModal;
