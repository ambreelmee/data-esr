import React, { Component } from 'react';
import {
  Badge, Button, ButtonGroup, ButtonDropdown, DropdownToggle, DropdownMenu,
  DropdownItem, Row, Col, Card, CardHeader, CardFooter, CardBody, Label, Input,
  Modal, ModalBody, ModalHeader, ModalFooter,
  Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';

import MapContainer from './MapContainer';

class EtablissementContainer extends Component {

  render() {
    const savedAddress = {
      business_name: 'La Sorbonne',
      adresse1: '1 Rue Victor Cousin',
      adresse2: '',
      zip_code: '75005',
      city: 'Paris',
      country: 'France',
    };
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <MapContainer savedAddress={savedAddress} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EtablissementContainer;
