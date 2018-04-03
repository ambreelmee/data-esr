import React, { Component } from 'react';
import {
  Badge, Button, ButtonGroup, ButtonDropdown, DropdownToggle, DropdownMenu,
  DropdownItem, Row, Col, Card, CardHeader, CardFooter, CardBody, Label, Input,
  Modal, ModalBody, ModalHeader, ModalFooter,
  Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';

import MapContainer from './MapContainer';

class EtablissementContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      institution: {},
      isLoading: false,
    };
    this.getData = this.getData.bind(this);
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    this.getData();
  }

  getData() {
    fetch(`${process.env.API_URL_STAGING}institutions/1`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        console.log('jesuisla')
        this.setState({
          institution: data.institution,
          isLoading: false,
        });
      });
  }

  getCurrentAddress() {
    return this.state.institution.addresses.filter(address => address.status === 'active');
  }

  render() {
    if (this.state.isLoading) {
      return <p>Loading...</p>;
    }
    const currentAddress = this.getCurrentAddress()[0]
    console.log(currentAddress)
    const zipAndCity = `${currentAddress.zip_code}, ${currentAddress.city}`;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col md="4" className="pr-0">
            <Card>
              <CardHeader> Adresse de l&#39;établissement </CardHeader>
              <CardBody>
                <h4>{currentAddress.business_name}</h4>
                <p>{currentAddress.address_1}
                  {currentAddress.address_2 ? <br /> : <span />}
                  {currentAddress.address_2}<br />
                  {zipAndCity}<br />
                  {currentAddress.country}
                </p>
              </CardBody>
            </Card>
          </Col>
          <Col md="8" className="pl-0">
            <Card>
              <div className="m-2 text-center h6">Cliquer sur la carte pour ajuster la position </div>
              <MapContainer currentAddress={currentAddress} getAddress={this.getData} />
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
