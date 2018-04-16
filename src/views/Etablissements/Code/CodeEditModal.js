import React, { Component } from 'react';
import {
  Button, InputGroup, InputGroupAddon, InputGroupText, Label,
  Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col, FormGroup,
} from 'reactstrap';
import PropTypes from 'prop-types';


class CodeEditModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: this.props.content,
      date_start: this.props.date_start,
      date_end: this.props.date_end,
      errorMessage: '',
      isLoading: false,
      modal: true,
    };
    this.changeCode = this.changeCode.bind(this);
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

  changeCode() {
    this.setState({ isLoading: true });
    const code = {
      code_category_id: this.props.categoryId,
      content: this.state.content,
      date_start: this.state.date_start,
      date_end: this.state.date_end,
    };
    fetch(`${process.env.API_URL_STAGING}/codes/${this.props.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({ code }),
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
          this.props.getCodes();
        }
      });
  }


  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          Modifier le code {this.props.category.toUpperCase()}
        </ModalHeader>
        <ModalBody>
          <InputGroup className="mb-3">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                {this.props.category.toUpperCase()}
              </InputGroupText>
            </InputGroupAddon>
            <Input
              id="content"
              type="text"
              value={this.state.content}
              onChange={this.onChange}
              placeholder={this.state.content}
            />
          </InputGroup>
          <Row>
            <Col>
              <FormGroup>
                <Label>Date de début</Label>
                <Input
                  type="date"
                  id="date_start"
                  value={this.state.date_start || ''}
                  placeholder={this.state.date_start || ''}
                  onChange={this.onChange}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Date de fin</Label>
                <Input
                  type="date"
                  id="date_end"
                  value={this.state.date_end || ''}
                  placeholder={this.state.date_end || ''}
                  onChange={this.onChange}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <p className="mt-2 text-danger">{this.state.errorMessage}</p>
          <Button
            className="m-1 float-right"
            color="primary"
            disabled={this.state.isLoading}
            onClick={!this.state.isLoading ? this.changeCode : null}
          >
            {this.state.isLoading ?
              <div>
                <i className="fa fa-spinner fa-spin " />
                <span className="mx-1"> Ajout </span>
              </div> : <div />}
            Ajouter
          </Button>
          <Button color="secondary" onClick={this.toggle}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

CodeEditModal.propTypes = {
  category: PropTypes.string.isRequired,
  categoryId: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  date_end: PropTypes.string,
  date_start: PropTypes.string,
  getCodes: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

CodeEditModal.defaultProps = {
  date_end: null,
  date_start: null
}

export default CodeEditModal;