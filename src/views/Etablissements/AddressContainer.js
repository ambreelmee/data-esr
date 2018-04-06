import React, { Component } from 'react';
import {
  Button, ButtonGroup, ButtonDropdown, Collapse, DropdownToggle, DropdownMenu,
  DropdownItem, Row, Col, Card, CardHeader, CardBody, Tooltip,
} from 'reactstrap';
import PropTypes from 'prop-types';

import MapContainer from './MapContainer';
import AddressModal from './AddressModal';
import Address from './Address';


class AddressContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: false,
      displayAddressDropdown: false,
      editModal: false,
      addModal: false,
      tooltip: false,
    };
    this.displayArchivedAddresses = this.displayArchivedAddresses.bind(this);
    this.displayAddressDropdown = this.displayAddressDropdown.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleToolTip = this.toggleToolTip.bind(this);
  }

  getCurrentAddress() {
    return this.props.addresses.filter(address => address.status === 'active');
  }

  getArchivedAddresses() {
    return this.props.addresses.filter(address => address.status === 'archived');
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

  toggleToolTip() {
    this.setState({
      tooltip: !this.state.tooltip,
    });
  }

  displayAddressDropdown() {
    this.setState({
      displayAddressDropdown: !this.state.displayAddressDropdown,
    });
  }

  displayArchivedAddresses() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  renderArchivedAddresses() {
    return this.getArchivedAddresses().map(address =>
      (
        <tr>
          <td key={address.id}>
            <Address
              address_1={address.address_1}
              address_2={address.address_2}
              business_name={address.business_name}
              city={address.city}
              country={address.country}
              date_start={address.date_start}
              date_end={address.date_end}
              id={address.id}
              phone={address.phone}
              status={address.status}
              zip_code={address.zip_code}
            />
          </td>
        </tr>
      ));
  }

  render() {
    const currentAddress = this.getCurrentAddress()[0];
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
              <Address
                address_1={currentAddress.address_1}
                address_2={currentAddress.address_2}
                business_name={currentAddress.business_name}
                city={currentAddress.city}
                country={currentAddress.country}
                date_start={currentAddress.date_start}
                date_end={currentAddress.date_end}
                phone={currentAddress.phone}
                status={currentAddress.status}
                zip_code={currentAddress.zip_code}
              />
              <Button
                outline
                id="voir-plus"
                className="float-right"
                color="secondary"
                size="sm"
                onClick={this.displayArchivedAddresses}
              >
                <i className="icon-eye" />
              </Button>
              <Tooltip placement="bottom" isOpen={this.state.tooltip} target="voir-plus" toggle={this.toggleToolTip}>
                {this.state.collapse ? 'voir moins' : 'voir plus'}
              </Tooltip>
            </CardBody>
          </Card>
          <Collapse
            isOpen={this.state.collapse}
          >
            <Card>
              <CardBody className="p-0">
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
