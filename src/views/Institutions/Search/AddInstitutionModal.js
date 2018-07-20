import React, { Component } from 'react';
import {
  Card, CardBody, Col, Form, FormGroup,
  Input, Label, Modal, ModalBody, ModalHeader, Row,
} from 'reactstrap';
import PropTypes from 'prop-types';
import AddInstitutionModalFooter from './AddInstitutionModalFooter';


class AddInstitutionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initials: '',
      text: '',
      date_start: '',
      date_end: '',
      status: 'active',
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
    const institution = {
      initials: this.state.initials,
      name: this.state.text,
      date_start: this.state.date_start,
      date_end: this.state.date_end,
    };
    this.props.createInstitution(JSON.stringify({ institution }));
  }


  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggleModal}>
        <ModalHeader toggle={this.props.toggleModal}>
          Ajouter un établissement
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
                      value={this.state.initials}
                      placeholder="Sigle de l'établissement"
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
                    value={this.state.text}
                    placeholder="Nom complet de l'établissement"
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
                        value={this.state.date_start}
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
                        value={this.state.date_end}
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
                        checked={this.state.status === 'active'}
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
                        checked={this.state.status === 'archived'}
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
        <AddInstitutionModalFooter
          hasErrored={this.props.hasErrored}
          isLoading={this.props.isLoading}
          message="Créer un établissement"
          toggleModal={this.props.toggleModal}
          triggerAction={this.triggerAction}
        />
      </Modal>

    );
  }
}

AddInstitutionModal.propTypes = {
  createInstitution: PropTypes.func.isRequired,
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  modal: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default AddInstitutionModal;
