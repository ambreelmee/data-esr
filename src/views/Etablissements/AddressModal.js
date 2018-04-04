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
      country: this.props.coutry,
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
    const institution = {
      name: this.state.name,
      date_start: this.state.date_start ? this.state.date_start : null,
      date_end: this.state.date_end ? this.state.date_end : null,
    };
    fetch(`${process.env.PROXY_URL + process.env.API_URL}institutions`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${localStorage.getItem('token')}:`)}`,
      }),
      body: JSON.stringify(institution),
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
      country: this.state.coutry,
      date_start: this.state.date_start,
      date_end: this.state.date_end,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      phone: this.state.phone,
      zip_code: this.state.zip_code,
    };
    console.log(modifiedAddress)
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
        this.props.getAddress();
        this.setState({
          modal: !this.state.modal,
        });
      })
      .catch((error) => {
        this.setState({
          errorMessage: !this.state.errorMessage,
        });
      });
  }

  toggle() {
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
                    value={this.state.business_name}
                    placeholder={this.props.business_name ? this.props.business_name : 'Nom ou raison sociale'}
                    onChange={this.onChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Champ adresse 1</Label>
                  <Input
                    id="address_1"
                    type="text"
                    value={this.state.address_1}
                    placeholder={this.props.address_1 ? this.props.address_1 : 'Numéro et voie postale'}
                    onChange={this.onChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Champ adresse 2</Label>
                  <Input
                    id="address_2"
                    type="text"
                    value={this.state.address_2}
                    placeholder={this.props.address_2 ? this.props.address_2 : 'Batiment, étage, ...'}
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
                        value={this.state.zip_code}
                        placeholder={this.props.zip_code ? this.props.zip_code : 'Code postal'}
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
                        value={this.state.city}
                        placeholder={this.props.city ? this.props.city : 'Ville'}
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
                        value={this.state.country}
                        placeholder={this.props.country ? this.props.country : 'France'}
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
                        value={this.state.phone}
                        placeholder={this.props.phone ? this.props.phone : '06...'}
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
                        value={this.state.date_start}
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
                        value={this.state.latitude}
                        placeholder={this.state.latitude ? this.state.latitude : ''}
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
                        placeholder={this.state.longitude ? this.state.longitude : ''}
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
