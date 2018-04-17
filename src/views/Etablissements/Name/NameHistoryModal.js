import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';
import PropTypes from 'prop-types';

import NameHistoryModalRow from './NameHistoryModalRow';


class NameHistoryModal extends Component {
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
    return this.props.history.map(name =>
      (
        <NameHistoryModalRow
          key={name.id}
          deleteName={this.props.deleteName}
          date_end={name.date_end}
          date_start={name.date_start}
          etablissement_id={this.props.etablissement_id}
          getNames={this.props.getNames}
          id={name.id}
          initials={name.initials}
          text={name.text}
          status={name.status}
        />));
  }

  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          Historique des noms
        </ModalHeader>
        <ModalBody>
          <Table hover bordered striped responsive size="sm">
            <thead>
              <tr>
                <th>Sigle</th>
                <th>Nom complet</th>
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

NameHistoryModal.propTypes = {
  deleteName: PropTypes.func.isRequired,
  etablissement_id: PropTypes.number.isRequired,
  getNames: PropTypes.func.isRequired,
  history: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default NameHistoryModal;
