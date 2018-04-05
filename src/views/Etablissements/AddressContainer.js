import React, { Component } from 'react';
import {
  Badge, Button, ButtonGroup, ButtonDropdown, Collapse, DropdownToggle, DropdownMenu,
  DropdownItem, Row, Col, Card, CardHeader, CardFooter, CardBody, Label, Input,
  Modal, ModalBody, ModalHeader, ModalFooter,
  Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import PropTypes from 'prop-types';

import MapContainer from './MapContainer';
import AddressModal from './AddressModal';

class AddressContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: false,
      displayAddressDropdown: false,
      editModal: false,
      addModal: false,
    };
    this.displayArchivedAddresses = this.displayArchivedAddresses.bind(this);
    this.displayAddressDropdown = this.displayAddressDropdown.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
  }

  displayArchivedAddresses() {
    this.setState({
      collapse: !this.state.collapse
    });
  }

  displayAddressDropdown() {
    this.setState({
      displayAddressDropdown: !this.state.displayAddressDropdown
    });
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

  getCurrentAddress() {
    return this.props.addresses.filter(address => address.status === 'active');
  }

  getArchivedAddresses() {
    return this.props.addresses.filter(address => address.status === 'archived')
  }


  renderAddress(address) {
    return (
      <div>
        <Badge
          color={address.status === 'active' ? "success" : "danger"}
          className="float-right"
        >
          {address.status}
        </Badge>
        {address.business_name}<br />
        {address.address_1}
        {address.address_2 ? <br /> : <span />}
        {address.address_2}<br />
        {`${address.zip_code}, ${address.city}`}<br />
        {address.country}
        {address.phone ? <span><br /><i className="icon-phone pr-1" /></span> : <span />}{address.phone}
        {address.date_start ? <span><br /><span className="mr-1">début d&#39;activité :</span></span> : <span />}{address.date_start}
        {address.date_end ? <span><br /><span className="mr-1">fin d&#39;activité :</span></span> : <span />}{address.date_end}
      </div>
    )
  }

  renderArchivedAddresses() {
    const addresses = this.getArchivedAddresses().map(address =>
      (
        <tr>
          <td key={address.id}>
            {this.renderAddress(address)}
          </td>
        </tr>
      ));
    return addresses;
  }

  render() {
    const currentAddress = this.getCurrentAddress()[0]
    const zipAndCity = `${currentAddress.zip_code}, ${currentAddress.city}`;
    return (
      <Row>
        <Col md="4">
          <Card className="mb-0">
            <CardHeader>
              Adresse de l&#39;établissement
              <ButtonGroup className="float-right">
                <ButtonDropdown
                  id="adressDropdown"
                  isOpen={this.state.displayAddressDropdown}
                  toggle={this.displayAddressDropdown}
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
                          getAddress={this.props.getAddress}
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
                          getAddress={this.props.getAddress}
                          toggleModal={this.toggleAddModal}
                        />) : <div /> }
                    </DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </ButtonGroup>
            </CardHeader>
            <CardBody>
            {this.renderAddress(currentAddress)}
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
              <CardBody className="pt-0">
                <table className="table">
                  <tbody>
                    {this.renderArchivedAddresses()}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Collapse>
        </Col>
        <Col md="8" className="pl-0">
          <Card>
            <MapContainer currentAddress={currentAddress} getAddress={this.props.getAddress} />
          </Card>
        </Col>
      </Row>
    );
  }
}

AddressContainer.propTypes = {
  addresses: PropTypes.array.isRequired,
  getAddress: PropTypes.func.isRequired,
}

export default AddressContainer;
