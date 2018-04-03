import React, { Component } from 'react';
import {
  Badge, Button, ButtonGroup, ButtonDropdown, DropdownToggle, DropdownMenu,
  DropdownItem, Row, Col, Card, CardHeader, CardFooter, CardBody, Label, Input,
  Modal, ModalBody, ModalHeader, ModalFooter,
  Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';

import MapContainer from './MapContainer';

class EtablissementContainer extends Component {

  getAddress() {
    const Address = {
      business_name: 'La Sorbonne',
      address1: '1 Rue Victor Cousin',
      address2: '',
      zip_code: '75005',
      city: 'Paris',
      country: 'France',
      lat: 48.849607,
      lng: 2.343567,
    };
    return Address;
  }

  render() {
    const savedAddress = this.getAddress();
    const zipAndCity = `${savedAddress.zip_code} ,${savedAddress.city}`;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col md="4" className="pr-0">
            <Card>
              <CardHeader> Adresse de l&#39;établissement </CardHeader>
              <CardBody>
              <h4>{savedAddress.business_name}</h4>
              <p>{savedAddress.address1}
                {savedAddress.address2 ? <br /> : <span />}
                {savedAddress.address2}<br />
                {zipAndCity}<br />
                {savedAddress.country}
              </p>
              </CardBody>
            </Card>
          </Col>
          <Col md="8" className="pl-0">
            <Card>
              <div className="m-2 text-center h6">Cliquer sur la carte pour ajuster la position </div>
              <MapContainer savedAddress={savedAddress} getAddress={this.getAddress} />
            </Card>
          </Col>
        </Row>
        <Row>
          another Row
        </Row>
      </div>
    );
  }
}

export default EtablissementContainer;
