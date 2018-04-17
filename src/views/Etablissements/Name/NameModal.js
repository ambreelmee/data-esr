import React, { Component } from 'react';
import {
  Button, Card, CardBody, Col, Form, FormGroup,
  Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';


class NameModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initials: this.props.initials,
      text: this.props.text,
      date_start: this.props.date_start,
      date_end: this.props.date_end,
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
      this.modifyCurrentName();
    } else if (this.props.etablissement_id) {
      this.addNewName();
    } else {
      this.createInstitution();
    }
  }

  toggle() {
    this.props.toggleModal();
    this.setState({
      modal: !this.state.modal,
      errorMessage: '',
    });
  }

  addNewName() {
    this.setState({ isLoading: true });
    const newName = {
      initials: this.state.initials,
      text: this.state.text,
      date_start: this.state.date_start,
      date_end: this.state.date_end,
      redirectToNewInstitutionId: null,
    };
    fetch(`${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}/institution_names`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({ institution_name: newName }),
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
          this.props.getNames();
        }
      });
  }

  createInstitution() {
    this.setState({ isLoading: true });
    const newInstitution = {
      initials: this.state.initials,
      name: this.state.text,
      date_start: this.state.date_start,
      date_end: this.state.date_end,
    };
    fetch(`${process.env.API_URL_STAGING}institutions/`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({ institution: newInstitution }),
    })
      .then(res => res.json())
      .then((data) => {
        if (data === 'Record not found') {
          this.setState({
            errorMessage: 'Formulaire vide ou incomplet',
            isLoading: false,
          });
        } else {
          this.setState({ redirectToNewInstitutionId: data.institution.id });
        }
      });
  }

  modifyCurrentName() {
    this.setState({ isLoading: true });
    const modifiedName = {
      initials: this.state.initials,
      text: this.state.text,
      date_start: this.state.date_start,
      date_end: this.state.date_end,
    };
    fetch(
      `${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}/institution_names/${this.props.id}`,
      {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
        body: JSON.stringify({ institution_name: modifiedName }),
      },
    )
      .then(res => res.json())
      .then(() => {
        this.toggle();
        this.setState({ isLoading: false });
        this.props.getNames();
      });
  }

  render() {
    if (this.state.redirectToNewInstitutionId) {
      return <Redirect to={`/etablissements/${this.state.redirectToNewInstitutionId}`} />
    }
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          {this.props.id ? 'Modifier le nom' : 'Ajouter un nom'}
        </ModalHeader>
        <ModalBody>
          Les champs colorés sont obligatoires
          <Card>
            <CardBody>
              <Form className="form-horizontal">
                <FormGroup row className="was-validated">
                  <Col md="6">
                    <Label>Sigle (min 2 caractères)</Label>
                  </Col>
                  <Col md="6">
                    <Input
                      id="initials"
                      className="form-control-warning"
                      required
                      type="text"
                      value={this.state.initials ? this.state.initials : ''}
                      placeholder={this.state.initials ? this.state.initials : "Sigle de l'établissement"}
                      onChange={this.onChange}
                    />
                  </Col>
                </FormGroup>
                <FormGroup className="was-validated">
                  <Label>Champ adresse 1</Label>
                  <Input
                    id="text"
                    type="text"
                    className="form-control-warning"
                    required
                    value={this.state.text ? this.state.text : ''}
                    placeholder={this.state.text ? this.state.text : "Nom complet de l'établissement"}
                    onChange={this.onChange}
                  />
                </FormGroup>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>Date de début d&#39;activité</Label>
                      <Input
                        type="date"
                        id="date_start"
                        value={this.state.date_start ? this.state.date_start : ''}
                        placeholder={this.state.date_start ? this.state.date_start : ''}
                        onChange={this.onChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Date de fin d&#39;activité</Label>
                      <Input
                        type="date"
                        id="date_end"
                        value={this.state.date_end ? this.state.date_end : ''}
                        placeholder={this.state.date_end ? this.state.date_end : ''}
                        onChange={this.onChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
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
              </div> :
              <div>
                {this.props.id ? 'Modifier le nom' : this.props.etablissement_id ? 'Ajouter un nom' : 'Créer un établissement'}
              </div>}
          </Button>
          <Button color="secondary" onClick={this.toggle}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

NameModal.propTypes = {
  id: PropTypes.number,
  initials: PropTypes.string,
  date_start: PropTypes.string,
  date_end: PropTypes.string,
  etablissement_id: PropTypes.number,
  getNames: PropTypes.func,
  text: PropTypes.string,
  toggleModal: PropTypes.func.isRequired,
};

NameModal.defaultProps = {
  id: null,
  initials: null,
  date_start: null,
  date_end: null,
  etablissement_id: null,
  getNames: null,
  text: null,
};

export default NameModal;
