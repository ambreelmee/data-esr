import React, { Component } from 'react';
import {
  Button, InputGroup, InputGroupAddon, InputGroupText,
  Input, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';


class LinkModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      modal: true,
      errorMessage: '',
      isLoading: false,
    };
    this.addNewLink = this.addNewLink.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  toggle() {
    this.props.toggleModal();
    this.setState({
      modal: !this.state.modal,
      errorMessage: '',
    });
  }

  addNewLink() {
    this.setState({ isLoading: true });
    const newLink = {
      link_category_id: this.props.categoryId,
      content: this.state.content,
    };
    fetch(`${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}/links`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({ link: newLink }),
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
          this.props.getLinks();
        }
      });
  }


  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          Ajouter un lien
        </ModalHeader>
        <ModalBody>
          <InputGroup className="mb-3">
            <InputGroupAddon addonType="prepend">
              <InputGroupText id={`category-${this.props.categoryId}`}>
                <i className={this.props.className ? this.props.className : 'fa fa-at'} />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              id="content"
              type="text"
              value={this.state.content}
              onChange={this.onChange}
              placeholder={this.props.category}
            />
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <p className="mt-2 text-danger">{this.state.errorMessage}</p>
          <Button
            className="m-1 float-right"
            color="primary"
            disabled={this.state.isLoading}
            onClick={!this.state.isLoading ? this.addNewLink : null}
          >
            {this.state.isLoading ?
              <div>
                <i className="fa fa-spinner fa-spin " />
                <span className="mx-1">Ajout</span>
              </div> : <div>Ajouter un lien</div>}
          </Button>
          <Button color="secondary" onClick={this.toggle}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

LinkModal.propTypes = {
  category: PropTypes.string.isRequired,
  categoryId: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,
  etablissement_id: PropTypes.number.isRequired,
  getLinks: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

LinkModal.defaultProps = {
};

export default LinkModal;
