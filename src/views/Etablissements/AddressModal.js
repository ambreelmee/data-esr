import React, { Component } from 'react';
import {
  Button, Card, CardBody, CardHeader, Col, Form, FormGroup,
  Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row,
} from 'reactstrap';
import PropTypes from 'prop-types';


class AddressModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address_1: this.props.address_1,
      address_2: this.props.address_2,
      business_name: this.props.business_name,
      city: this.props.city,
      country: this.props.country,
      date_start: this.props.date_start,
      date_end: this.props.date_end,
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      phone: this.props.phone,
      zip_code: this.props.zip_code,
      modal: true,
      errorMessage: '',
    };
    this.triggerAction = this.triggerAction.bind(this);
    this.modifyCurrentAddress = this.modifyCurrentAddress.bind(this);
    this.postInstitution = this.postInstitution.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  triggerAction() {
    if (this.props.id) {
      this.modifyCurrentAddress();
    } else {
      this.postInstitution();
    }
  }

  postInstitution() {
    const newAddress = {
      address_1: this.state.address_1,
      address_2: this.state.address_2,
      business_name: this.state.business_name,
      city: this.state.city,
      country: this.state.country,
      date_start: this.state.date_start,
      date_end: this.state.date_end,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      phone: this.state.phone,
      zip_code: this.state.zip_code,
    };
    fetch(`${process.env.PROXY_URL + process.env.API_URL_STAGING}institutions/1/addresses`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({"address" : newAddress}),
    })
      .then(res => res.json())
      .then(() => {
        this.setState({
          errorMessage: '',
          modal: !this.state.modal,
        });
        this.props.getAddress();
      })
      .catch(() => {
        this.setState({
          errorMessage: 'Formulaire incomplet',
        });
      });
  }

  modifyCurrentAddress() {
    const modifiedAddress = {
      address_1: this.state.address_1,
      address_2: this.state.address_2,
      business_name: this.state.business_name,
      city: this.state.city,
      country: this.state.country,
      date_start: this.state.date_start,
      date_end: this.state.date_end,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      phone: this.state.phone,
      zip_code: this.state.zip_code,
    };
    fetch(`${process.env.PROXY_URL + process.env.API_URL_STAGING}institutions/1/addresses/${this.props.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify(modifiedAddress),
    })
      .then(res => res.json())
      .then(() => {
        this.setState({
          modal: !this.state.modal,
        });
        this.props.getAddress();
      })
      .catch(() => {
        this.setState({
          errorMessage: 'formulaire incomplet',
        });
      });
  }

  toggle() {
    this.props.toggleModal();
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>{this.props.id ? "Modifier l'adresse actuelle" : 'Ajouter une adresse'}</ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              <Form className="form-horizontal">
                <FormGroup>
                  <Label>Nom ou raison sociale</Label>
                  <Input
                    id="business_name"
                    type="text"
                    value={this.state.business_name ? this.state.business_name : ''}
                    placeholder={this.state.business_name ? this.state.business_name : 'Nom ou raison sociale'}
                    onChange={this.onChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Champ adresse 1</Label>
                  <Input
                    id="address_1"
                    type="text"
                    value={this.state.address_1 ? this.state.address_1 : ''}
                    placeholder={this.state.address_1 ? this.state.address_1 : 'Numéro et voie postale'}
                    onChange={this.onChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Champ adresse 2</Label>
                  <Input
                    id="address_2"
                    type="text"
                    value={this.state.address_2 ? this.state.address_2 : ''}
                    placeholder={this.state.address_2 ? this.state.address_2 : 'Batiment, étage, ...'}
                    onChange={this.onChange}
                  />
                </FormGroup>
                <Row md="5">
                  <Col>
                    <FormGroup>
                      <Label>Code Postal</Label>
                      <Input
                        id="zip_code"
                        type="text"
                        value={this.state.zip_code ? this.state.zip_code : ''}
                        placeholder={this.state.zip_code ? this.state.zip_code : 'Code postal'}
                        onChange={this.onChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="7">
                    <FormGroup>
                      <Label>Ville</Label>
                      <Input
                        id="city"
                        type="text"
                        value={this.state.city ? this.state.city : ''}
                        placeholder={this.state.city ? this.state.city : 'Ville'}
                        onChange={this.onChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="5">
                    <FormGroup>
                      <Label>Pays</Label>
                      <Input
                        id="country"
                        type="text"
                        value={this.state.country ? this.state.country : ''}
                        placeholder={this.state.country ? this.state.country : 'France'}
                        onChange={this.onChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="7">
                    <FormGroup>
                      <Label>Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={this.state.phone ? this.state.phone : ''}
                        placeholder={this.state.phone ? this.state.phone : '06...'}
                        onChange={this.onChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
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
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>Latitude</Label>
                      <Input
                        type="number"
                        id="latitude"
                        value={this.state.latitude ? this.state.latitude : ''}
                        placeholder={this.state.latitude ? this.state.latitude : '48.84...'}
                        onChange={this.onChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Longitude</Label>
                      <Input
                        type="number"
                        id="longitude"
                        value={this.state.longitude ? this.state.longitude : ''}
                        placeholder={this.state.longitude ? this.state.longitude : '2.34..'}
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
          <p className="text-danger">{this.state.errorMessage}</p>
          <Button color="primary" onClick={this.triggerAction}>{this.props.id ? "Modifier l'" : 'Ajouter une '}adresse</Button>
          <Button color="secondary" onClick={this.toggle}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

AddressModal.propTypes = {
  address_1: PropTypes.string,
  address_2: PropTypes.string,
  business_name: PropTypes.string,
  id: PropTypes.number,
  city: PropTypes.string,
  country: PropTypes.string,
  date_start: PropTypes.string,
  date_end: PropTypes.string,
  getAddress: PropTypes.func.isRequired,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  phone: PropTypes.string,
  toggleModal: PropTypes.func.isRequired,
  zip_code: PropTypes.string,
};

AddressModal.defaultProps = {
  address_1: null,
  address_2: null,
  business_name: null,
  city: null,
  country: null,
  date_start: null,
  date_end: null,
  id: null,
  latitude: null,
  longitude: null,
  phone: null,
  zip_code: null,
};

export default AddressModal;
