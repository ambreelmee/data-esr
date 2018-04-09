import React, { Component } from 'react';
import {
  Button, ButtonGroup, ButtonDropdown, Collapse, DropdownToggle, DropdownMenu,
  DropdownItem, Row, Col, Card, CardHeader, CardBody, Tooltip,
} from 'reactstrap';
import PropTypes from 'prop-types';

import { getActiveEntity, getArchivedEntities } from './../methods';

import MapContainer from './MapContainer';
import AddressModal from './AddressModal';
import Address from './Address';


class AddressContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addresses: {},
      collapse: false,
      displayDropdown: false,
      editModal: false,
      addModal: false,
      tooltip: false,
      isLoading: false,
    };
    this.getAddresses = this.getAddresses.bind(this);
    this.displayArchivedEntities = this.displayArchivedEntities.bind(this);
    this.displayDropdown = this.displayDropdown.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleToolTip = this.toggleToolTip.bind(this);
  }

  componentWillMount() {
    this.getAddresses();
  }


  getAddresses() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}/addresses`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          addresses: data,
          isLoading: false,
        });
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

  toggleToolTip() {
    this.setState({
      tooltip: !this.state.tooltip,
    });
  }

  displayDropdown() {
    this.setState({
      displayDropdown: !this.state.displayDropdown,
    });
  }

  displayArchivedEntities() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  renderArchivedEntities() {
    return getArchivedEntities(this.state.addresses).map(address =>
      (
        <tr key={address.id}>
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
              getAddresses={this.getAddresses}
              phone={address.phone}
              status={address.status}
              zip_code={address.zip_code}
            />
          </td>
        </tr>
      ));
  }

  render() {
    if (this.state.isLoading) {
      return <p>Loading...</p>;
    }
    const currentAddress = getActiveEntity(this.state.addresses);
    return (
      <Row>
        <Col md="4">
          <Card className="mb-0">
            <CardHeader>
              Adresse de l&#39;établissement
              <ButtonGroup className="float-right">
                <ButtonDropdown
                  id="adressDropdown"
                  isOpen={this.state.displayDropdown}
                  toggle={this.displayDropdown}
                >
                  <DropdownToggle caret className="p-0" color="light">
                    <i className="icon-settings" />
                  </DropdownToggle>
                  <DropdownMenu>
                    {currentAddress ?
                      <DropdownItem onClick={this.toggleEditModal}>
                        <i className="icon-pencil" />
                        Modifier l&#39;adresse actuelle
                        {this.state.editModal ?
                          (<AddressModal
                            getAddresses={this.getAddresses}
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
                      </DropdownItem> : <div />}
                    <DropdownItem onClick={this.toggleAddModal}>
                      <i className="icon-plus" />
                      Ajouter une nouvelle adresse
                      {this.state.addModal ?
                        (<AddressModal
                          getAddresses={this.getAddresses}
                          toggleModal={this.toggleAddModal}
                        />) : <div /> }
                    </DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </ButtonGroup>
            </CardHeader>
            {currentAddress ?
              <CardBody>
                <Address
                  address_1={currentAddress.address_1}
                  address_2={currentAddress.address_2}
                  business_name={currentAddress.business_name}
                  city={currentAddress.city}
                  country={currentAddress.country}
                  date_start={currentAddress.date_start}
                  date_end={currentAddress.date_end}
                  id={currentAddress.id}
                  phone={currentAddress.phone}
                  status={currentAddress.status}
                  zip_code={currentAddress.zip_code}
                />
                {getArchivedEntities(this.state.addresses).length > 0 ?
                  <span>
                    <Button
                      outline
                      id="voir-plus"
                      className="float-right"
                      color="secondary"
                      size="sm"
                      onClick={this.displayArchivedEntities}
                    >
                      <i className="icon-eye" />
                    </Button>
                    <Tooltip
                      placement="bottom"
                      isOpen={this.state.tooltip}
                      target="voir-plus"
                      toggle={this.toggleToolTip}
                    >
                      {this.state.collapse ? 'voir moins' : 'voir plus'}
                    </Tooltip>
                  </span> : <span />}
              </CardBody> : <CardBody><em>Aucune adresse enregistrée actuellement...</em></CardBody>}
          </Card>
          <Collapse
            isOpen={this.state.collapse}
          >
            <Card>
              <CardBody className="p-0">
                <table className="table">
                  <tbody>
                    {this.renderArchivedEntities()}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Collapse>
        </Col>
        <Col md="8" className="pl-0">
          <Card>
            {currentAddress ?
              <MapContainer currentAddress={currentAddress} getAddresses={this.getAddresses} /> :
              <div />}
          </Card>
        </Col>
      </Row>
    );
  }
}

AddressContainer.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
};

export default AddressContainer;
