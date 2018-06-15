import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';
import PropTypes from 'prop-types';

import NameHistoryModalRow from './NameHistoryModalRow';
import NameModal from './NameModal';

class NameHistoryModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addModal: false,
      modal: true,
    };
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggleAddModal() {
    this.setState({
      addModal: !this.state.addModal,
    });
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
          date_end={name.date_end}
          date_start={name.date_start}
          etablissement_id={this.props.etablissement_id}
          getData={this.props.getData}
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
          Detail des noms officiels
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
          <Button color="primary" className="float-right" onClick={this.toggleAddModal}>
            <i className="fa fa-plus mr-1" />
            Ajouter un nom
          </Button>
          {this.state.addModal ?
            (<NameModal
              etablissement_id={this.props.etablissement_id}
              getData={this.props.getData}
              toggleModal={this.toggleAddModal}
            />) : <div /> }
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.toggle}>Fermer</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

NameHistoryModal.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
  getData: PropTypes.func.isRequired,
  history: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default NameHistoryModal;
