import React, { Component } from 'react';
import {
  Button, Card, CardBody, Col, Form, FormGroup,
  Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row,
} from 'reactstrap';
import PropTypes from 'prop-types';


class LinkModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: this.props.content,
      modal: true,
      errorMessage: '',
      isLoading: false,
    };
    this.triggerAction = this.triggerAction.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  triggerAction() {
    if (this.props.id) {
      this.modifyCurrentLink();
    } else {
      this.addNewLink();
    }
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
      category_link_id: this.props.categoryId,
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

  modifyCurrentLink() {
    this.setState({ isLoading: true });
    const modifiedLink = {
      category_link_id: this.props.categoryId,
      content: this.state.content,
    };
    fetch(
      `${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}/links/${this.props.id}`,
      {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
        body: JSON.stringify({ link: modifiedLink }),
      },
    )
      .then(res => res.json())
      .then(() => {
        this.toggle();
        this.setState({ isLoading: false });
        this.props.getLinks();
      });
  }

  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          {this.props.id ? 'Modifier le lien' : 'Ajouter un lien'}
        </ModalHeader>
        <ModalBody>
          <Form className="form-horizontal">
            <FormGroup row>
              <Col md="4" className="text-center">
                <Label className="my-1">{this.props.category}</Label>
              </Col>
              <Col md="8">
                <Input
                  id="content"
                  type="text"
                  value={this.state.content ? this.state.content : ''}
                  placeholder={this.state.content ? this.state.content : 'URL de la page...'}
                  onChange={this.onChange}
                />
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <p className="mt-2 text-danger">{this.state.errorMessage}</p>
          <Button
            className="m-1 float-right"
            color="primary"
            disabled={this.state.isLoading}
            onClick={!this.state.isLoading ? this.triggerAction : null}
          >
            {this.state.isLoading ?
              <div>
                <i className="fa fa-spinner fa-spin " />
                <span className="mx-1"> Modification </span>
              </div> : <div />}
            {this.props.id ? 'Modifier le ' : 'Ajouter un '}lien
          </Button>
          <Button color="secondary" onClick={this.toggle}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

LinkModal.propTypes = {
  id: PropTypes.number,
  content: PropTypes.string,
  category: PropTypes.string,
  categoryId: PropTypes.number.isRequired,
  etablissement_id: PropTypes.number.isRequired,
  getLinks: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

LinkModal.defaultProps = {
  id: null,
  content: null,
  category: null,
};

export default LinkModal;
