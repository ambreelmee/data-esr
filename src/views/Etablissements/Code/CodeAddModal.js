import React, { Component } from 'react';
import {
  Button, InputGroup, InputGroupAddon, InputGroupText, Label,
  Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col, FormGroup,
} from 'reactstrap';
import PropTypes from 'prop-types';


class CodeAddModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      date_start: null,
      date_end: null,
      errorMessage: '',
      isLoading: false,
      modal: true,
      status: 1,
    };
    this.addNewCode = this.addNewCode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  onRadioChange(event) {
    this.setState({ status: event.target.id });
  }

  toggle() {
    this.props.toggleModal();
    this.setState({
      modal: !this.state.modal,
      errorMessage: '',
    });
  }

  addNewCode() {
    this.setState({ isLoading: true });
    const newCode = {
      code_category_id: this.props.categoryId,
      content: this.state.content,
      date_start: this.state.date_start,
      date_end: this.state.date_end,
      status: this.state.status,
    };
    fetch(`${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}/codes`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({ code: newCode }),
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
          Ajouter un nouveau code {this.props.category.toUpperCase()}
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
              placeholder="Code de l'établissement"
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
                  placeholder=""
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
                  value={this.state.date_end ? this.state.date_end : ''}
                  placeholder=""
                  onChange={this.onChange}
                />
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label>Statut</Label>
                </Col>
                <Col md="9">
                  <FormGroup check inline>
                    <Input
                      className="form-check-input"
                      type="radio"
                      id="1"
                      name="status"
                      value="1"
                      defaultChecked
                      onChange={this.onRadioChange}
                    />
                    <Label className="form-check-label" check htmlFor="1">Actif</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input
                      className="form-check-input"
                      type="radio"
                      id="0"
                      name="status"
                      value="0"
                      onChange={this.onRadioChange}
                    />
                    <Label className="form-check-label" check htmlFor="0">Archivé</Label>
                  </FormGroup>
                </Col>
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
            onClick={!this.state.isLoading ? this.addNewCode : null}
          >
            {this.state.isLoading ?
              <div>
                <i className="fa fa-spinner fa-spin " />
                <span className="mx-1"> Ajout </span>
              </div> : <div>Ajouter</div>}
          </Button>
          <Button color="secondary" onClick={this.toggle}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

CodeAddModal.propTypes = {
  category: PropTypes.string.isRequired,
  categoryId: PropTypes.number.isRequired,
  etablissement_id: PropTypes.number.isRequired,
  getCodes: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default CodeAddModal;
