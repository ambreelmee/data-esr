import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';
import PropTypes from 'prop-types';

import AddressHistoryModalRow from './AddressHistoryModalRow';


class AddressHistoryModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: true,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.toggleModal();
    this.setState({
      modal: !this.state.modal,
    });
  }

  renderTableRows() {
    return this.props.history.map(address =>
      (
        <AddressHistoryModalRow
          key={`address-${address.id}`}
          address_1={address.address_1}
          address_2={address.address_2}
          business_name={address.business_name}
          city={address.city}
          country={address.country}
          deleteAddress={this.props.deleteAddress}
          date_end={address.date_end}
          date_start={address.date_start}
          etablissement_id={this.props.etablissement_id}
          getAddresses={this.props.getAddresses}
          id={address.id}
          phone={address.phone}
          status={address.status}
          zip_code={address.zip_code}
        />));
  }

  render() {
    return (
      <Modal className="w-75 mw-100 px-5" isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          Historique des noms
        </ModalHeader>
        <ModalBody>
          <Table hover bordered striped responsive size="sm">
            <thead>
              <tr>
                <th>Raison sociale</th>
                <th>Champ adresse 1</th>
                <th>Champ adresse 2</th>
                <th>Code postale</th>
                <th>Ville</th>
                <th>Pays</th>
                <th>Téléphone</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Statut</th>
                <th>Action </th>
              </tr>
            </thead>
            <tbody>
              {this.renderTableRows()}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.toggle}>Fermer</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

AddressHistoryModal.propTypes = {
  deleteAddress: PropTypes.func.isRequired,
  etablissement_id: PropTypes.number.isRequired,
  getAddresses: PropTypes.func.isRequired,
  history: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default AddressHistoryModal;
