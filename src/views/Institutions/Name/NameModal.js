import React, { Component } from 'react';
import {
  Button, Card, CardBody, Col, Form, FormGroup,
  Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';


class NameModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initials: this.props.initials,
      text: this.props.text,
      date_start: this.props.date_start ? this.props.date_start : moment().format('YYYY-MM-DD'),
      date_end: this.props.date_end,
      status: this.props.status,
    };
    this.triggerAction = this.triggerAction.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  onRadioChange(event) {
    this.setState({ status: event.target.id });
  }

  triggerAction() {
    const jsonBody = JSON.stringify({
      institution_name:
        {
          initials: this.state.initials,
          text: this.state.text,
          date_start: this.state.date_start,
          date_end: this.state.date_end,
          status: this.state.status,
        },
    });
    if (this.props.id) {
      const url = `${process.env.API_URL_STAGING}institution_names/${this.props.id}`;
      this.props.addContent(url, jsonBody, 'PUT');
    } else if (this.props.institutionId) {
      const url = `${process.env.API_URL_STAGING}institutions/${this.props.institutionId}/institution_names`;
      this.props.addContent(url, jsonBody, 'POST');
    } else {
      const institution = {
        initials: this.state.initials,
        name: this.state.text,
        date_start: this.state.date_start,
        date_end: this.state.date_end,
      };
      this.props.createInstitution(JSON.stringify({ institution }));
    }
  }


  render() {
    if (this.state.redirectToNewInstitutionId) {
      return <Redirect to={`/etablissements/${this.state.redirectToNewInstitutionId}`} />;
    }
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggleModal}>
        <ModalHeader toggle={this.props.toggleModal}>
          {this.props.id ? 'Modifier le nom' : 'Ajouter un établissement'}
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
                  <Label>Nom de l&#39;établissement</Label>
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
                <FormGroup row>
                  <Col md="3">
                    <Label>Statut</Label>
                  </Col>
                  <Col md="9">
                    <FormGroup check inline>
                      <Input
                        className="form-check-input"
                        type="radio"
                        id="active"
                        name="status"
                        value="active"
                        defaultChecked={this.state.status === 'active'}
                        onChange={this.onRadioChange}
                      />
                      <Label className="form-check-label" check htmlFor="active">Actif</Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Input
                        className="form-check-input"
                        type="radio"
                        id="archived"
                        name="status"
                        value="archived"
                        defaultChecked={this.state.status === 'archived'}
                        onChange={this.onRadioChange}
                      />
                      <Label className="form-check-label" check htmlFor="archived">Archivé</Label>
                    </FormGroup>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <p className="mt-2 text-danger">
            {this.props.hasErrored ?
              'Opération impossible, veuillez vérifier que le formulaire est bien complet' : ''}
          </p>
          <Button
            className="m-1 float-right"
            color="primary"
            disabled={this.props.isLoading}
            onClick={!this.props.isLoading ? this.triggerAction : null}
          >
            {this.props.isLoading ?
              <div>
                <i className="fa fa-spinner fa-spin " />
                <span className="mx-1"> Modification </span>
              </div> :
              <div>
                {this.props.id ? 'Modifier le nom' : this.props.institutionId ? 'Ajouter un nom' : 'Créer un établissement'}
              </div>}
          </Button>
          <Button color="secondary" onClick={this.props.toggleModal}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

NameModal.propTypes = {
  addContent: PropTypes.func,
  closeModal: PropTypes.func,
  createInstitution: PropTypes.func,
  hasErrored: PropTypes.bool.isRequired,
  id: PropTypes.number,
  initials: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  date_start: PropTypes.string,
  date_end: PropTypes.string,
  institutionId: PropTypes.number,
  modal: PropTypes.bool,
  status: PropTypes.string,
  text: PropTypes.string,
  toggleModal: PropTypes.func.isRequired,
};

NameModal.defaultProps = {
  addContent: null,
  createInstitution: null,
  id: null,
  initials: null,
  date_start: null,
  date_end: null,
  institutionId: null,
  modal: true,
  status: 'active',
  text: null,
};

export default NameModal;
