import React, { Component } from 'react';
import {
  Badge, Button, ButtonGroup, ButtonDropdown, Collapse, DropdownToggle, DropdownMenu,
  DropdownItem, Row, Col, Card, CardHeader, CardFooter, CardBody, Label, Input,
  Modal, ModalBody, ModalHeader, ModalFooter,
  Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';

import MapContainer from './MapContainer';
import AddressModal from './AddressModal';

class EtablissementContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      institution: {},
      isLoading: false,
      collapse: false,
      displayAdressDropdown: false,
      editModal: false,
      addModal: false,
    };
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.renderArchivedAdresses = this.renderArchivedAdresses.bind(this);
    this.getData = this.getData.bind(this);
    this.displayArchivedAddresses = this.displayArchivedAddresses.bind(this);
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    this.getData();
  }

  getData() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/1`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          institution: data.institution,
          isLoading: false,
          editModal: false,
          addModal: false,
        });
      });
  }

  getCurrentAddress() {
    return this.state.institution.addresses.filter(address => address.status === 'active');
  }

  getArchivedAddresses() {
    return this.state.institution.addresses.filter(address => address.status === 'archived')
  }

  displayArchivedAddresses() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleEditModal() {
    this.setState({
      editModal: !this.state.editModal,
    });
  }

  toggleAddModal() {
    this.setState({
      addModal: !this.state.addModal,
    });
  }

  renderArchivedAdresses() {
    const addresses = this.getArchivedAddresses().map((address) => {
      return (
        <tr>
          <td key={address.id}>
            {address.business_name}<br />
            {address.address_1}
            {address.address_2 ? <br /> : <span />}
            {address.address_2}<br />
            {`${address.zip_code}, ${address.city}`}<br />
            {address.country}
            <Badge color="danger" className="float-right">Archivé</Badge>
          </td>
        </tr>)
    })
    return addresses
  }

  render() {
    if (this.state.isLoading) {
      return <p>Loading...</p>;
    }
    const currentAddress = this.getCurrentAddress()[0]
    const zipAndCity = `${currentAddress.zip_code}, ${currentAddress.city}`;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col md="4" className="pr-0">
            <Card className="mb-0">
              <CardHeader>
                Adresse de l&#39;établissement
                <ButtonGroup className="float-right">
                  <ButtonDropdown
                    id="adressDropdown"
                    isOpen={this.state.displayAdressDropdown}
                    toggle={() => { this.setState({ displayAdressDropdown: !this.state.displayAdressDropdown }); }}
                  >
                    <DropdownToggle caret className="p-0" color="light">
                      <i className="icon-settings" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={this.toggleEditModal}>
                        <i className="icon-pencil" />
                        Modifier l&#39;adresse actuelle
                        {this.state.editModal ?
                          (<AddressModal
                            getAddress={this.getData}
                            toggleModal={this.toggleEditModal}
                            address_1={currentAddress.address_1}
                            address_2={currentAddress.address_2}
                            business_name={currentAddress.business_name}
                            city={currentAddress.city}
                            country={currentAddress.country}
                            date_start={currentAddress.date_start}
                            date_end={currentAddress.date_end}
                            id={currentAddress.id}
                            latitude={currentAddress.latitude}
                            longitude={currentAddress.longitude}
                            phone={currentAddress.phone}
                            zip_code={currentAddress.zip_code}
                          />) : <div /> }
                      </DropdownItem>
                      <DropdownItem onClick={this.toggleAddModal}>
                        <i className="icon-plus" />
                        Ajouter une nouvelle adresse
                        {this.state.addModal ?
                          (<AddressModal
                            getAddress={this.getData}
                            toggleModal={this.toggleAddModal}
                          />) : <div /> }
                      </DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </ButtonGroup>
              </CardHeader>
              <CardBody>
              <Badge color="success" className="mt-1 float-right">Active</Badge>
                <h4>{currentAddress.business_name}</h4>
                {currentAddress.address_1}
                {currentAddress.address_2 ? <br /> : <span />}
                {currentAddress.address_2}<br />
                {zipAndCity}<br />
                {currentAddress.country}
                <Button outline className="float-right" color="secondary" size="sm" onClick={this.displayArchivedAddresses}>
                  <i className="icon-eye pr-1" />
                  {this.state.collapse ? 'voir moins' : 'voir plus'}
                </Button>
              </CardBody>
            </Card>
            <Collapse
              isOpen={this.state.collapse}
            >
              <Card>
                <CardBody className="py-0">
                  <table className="table">
                    <tbody>
                      {this.renderArchivedAdresses()}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </Collapse>
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
