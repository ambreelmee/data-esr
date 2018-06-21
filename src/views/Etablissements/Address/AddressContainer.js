import React, { Component } from 'react';
import {
  Button, ButtonGroup, ButtonDropdown, Card, CardBody, CardHeader, Col, DropdownItem,
  DropdownMenu, DropdownToggle, Modal, ModalBody, ModalFooter, ModalHeader, Row,
} from 'reactstrap';
import PropTypes from 'prop-types';

import { getActiveEntity } from './../methods';

import Address from './Address';
import AddressHistoryModal from './AddressHistoryModal';
import AddressModal from './AddressModal';
import ConnectionContainer from './../Relation/ConnectionContainer';
import CodeContainer from './../Code/CodeContainer';
import LeafletMap from './LeafletMap';


class AddressContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addresses: [],
      addModal: false,
      deleteModal: false,
      displayDropdown: false,
      editModal: false,
      historyModal: false,
      isLoading: false,
    };
    this.deleteAddress = this.deleteAddress.bind(this);
    this.displayDropdown = this.displayDropdown.bind(this);
    this.getAddresses = this.getAddresses.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleHistoryModal = this.toggleHistoryModal.bind(this);
  }

  componentWillMount() {
    this.getAddresses(this.props.etablissement_id);
  }

  componentWillReceiveProps(nextProps) {
    this.getAddresses(nextProps.etablissement_id);
  }


  getAddresses(etablissementId) {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${etablissementId}/addresses`, {
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

  deleteAddress(adressId, etablissementId) {
    this.setState({ isLoading: true });
    fetch(
      `${process.env.API_URL_STAGING}addresses/${adressId}`,
      {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')})`,
        }),
        body: JSON.stringify({ address: { id: adressId } }),
      },
    )
      .then(res => res.json())
      .then(() => {
        this.setState({
          isLoading: false,
        });
        this.getAddresses(etablissementId);
      });
  }


  toggleHistoryModal() {
    this.setState({
      historyModal: !this.state.historyModal,
    });
  }

  toggleDeleteModal() {
    this.setState({
      deleteModal: !this.state.deleteModal,
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

  displayDropdown() {
    this.setState({
      displayDropdown: !this.state.displayDropdown,
    });
  }

  render() {
    if (this.state.isLoading) {
      return <p />;
    }
    const replacementAddress = this.state.addresses ? this.state.addresses[0] : null;
    const displayedAddress = getActiveEntity(this.state.addresses) ?
      getActiveEntity(this.state.addresses) : replacementAddress;
    return (
      <Row>
        <Col md="8" className="pl-0">
          {displayedAddress && displayedAddress.latitude && displayedAddress.longitude ?
            <Card className="mt-2 mb-0">
              <LeafletMap
                currentAddress={displayedAddress}
                etablissement_id={this.props.etablissement_id}
                getAddresses={this.getAddresses}
              />
            </Card> : <div />}
          <ConnectionContainer etablissement_id={this.props.etablissement_id} />
        </Col>
        <Col md="4">
          <Row>
            <Card className="mb-0 mt-2 w-100">
              <CardHeader>
                Adresse de l&#39;établissement
                <ButtonGroup className="float-right">
                  <ButtonDropdown
                    id="nameDropdown"
                    isOpen={this.state.displayDropdown}
                    toggle={this.displayDropdown}
                  >
                    <DropdownToggle caret className="p-0" color="light">
                      <i className="icon-settings" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={this.toggleEditModal}>
                        <i className="fa fa-pencil text-warning" />
                          Modifier l&#39;adresse actuelle
                      </DropdownItem>
                      {this.state.editModal ?
                        (<AddressModal
                          getAddresses={this.getAddresses}
                          toggleModal={this.toggleEditModal}
                          address_1={displayedAddress.address_1}
                          address_2={displayedAddress.address_2}
                          business_name={displayedAddress.business_name}
                          city={displayedAddress.city}
                          country={displayedAddress.country}
                          date_start={displayedAddress.date_start}
                          date_end={displayedAddress.date_end}
                          etablissement_id={this.props.etablissement_id}
                          id={displayedAddress.id}
                          phone={displayedAddress.phone}
                          status={displayedAddress.status}
                          zip_code={displayedAddress.zip_code}
                        />) : <div /> }
                      <DropdownItem onClick={this.toggleAddModal}>
                        <i className="fa fa-plus text-success" />
                          Ajouter une nouvelle adresse
                      </DropdownItem>
                      {this.state.addModal ?
                        (<AddressModal
                          etablissement_id={this.props.etablissement_id}
                          getAddresses={this.getAddresses}
                          toggleModal={this.toggleAddModal}
                        />) : <div /> }
                      <DropdownItem onClick={this.toggleHistoryModal}>
                        <i className="fa fa-eye text-info" />
                          Voir l&#39;historique
                      </DropdownItem>
                      {this.state.historyModal ?
                        <AddressHistoryModal
                          deleteAddress={this.deleteAddress}
                          etablissement_id={this.props.etablissement_id}
                          getAddresses={this.getAddresses}
                          history={this.state.addresses}
                          toggleModal={this.toggleHistoryModal}
                        /> : <div />}
                      <DropdownItem onClick={this.toggleDeleteModal}>
                        <i className="fa fa-close text-danger" />
                          Supprimer le nom actuel
                        <Modal isOpen={this.state.deleteModal} toggle={this.toggleDeleteModal} color="danger">
                          <ModalHeader toggle={this.toggleDeleteModal}>
                            Suppression du champ
                          </ModalHeader>
                          <ModalBody>
                            Etes-vous sûr de vouloir supprimer ce champ ?
                          </ModalBody>
                          <ModalFooter>
                            <p className="mt-2 text-danger">{this.state.errorMessage}</p>
                            <Button
                              className="m-1 float-right"
                              color="danger"
                              disabled={this.state.isDeleting}
                              onClick={!this.state.isDeleting ? () => this.deleteAddress(displayedAddress.id, this.props.etablissement_id) : null}
                            >
                              {this.state.isDeleting ?
                                <div>
                                  <i className="fa fa-spinner fa-spin " />
                                  <span className="mx-1"> Suppression </span>
                                </div> : <div />}
                              Supprimer
                            </Button>
                            <Button color="secondary" onClick={this.toggleDeleteModal}>Annuler</Button>
                          </ModalFooter>
                        </Modal>
                      </DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </ButtonGroup>
              </CardHeader>
              {displayedAddress ?
                <CardBody>
                  <Address
                    address_1={displayedAddress.address_1}
                    address_2={displayedAddress.address_2}
                    business_name={displayedAddress.business_name}
                    city={displayedAddress.city}
                    id={displayedAddress.id}
                    phone={displayedAddress.phone}
                    status={displayedAddress.status}
                    zip_code={displayedAddress.zip_code}
                  />
                </CardBody> :
                <CardBody>
                  <em>Aucune adresse enregistrée actuellement...</em>
                  <Button color="primary" size="sm" className="float-right rounded" onClick={this.toggleAddModal}>
                    <i className="fa fa-plus mr-1" />
                    Ajouter une addresse
                  </Button>
                </CardBody>}
            </Card>
            <CodeContainer etablissement_id={this.props.etablissement_id} />
          </Row>
        </Col>
      </Row>
    );
  }
}

AddressContainer.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
};

export default AddressContainer;
