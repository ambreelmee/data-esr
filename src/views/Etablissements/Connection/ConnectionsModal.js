import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';

import ModalRow from './../ModalRow';


class ConnectionsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: true,
    };
    this.deleteConnection = this.deleteConnection.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.toggleModal();
    this.setState({
      modal: !this.state.modal,
    });
  }

  deleteConnection(etablissement_id, connectionType) {
    this.setState({ isDeleting: true });
    fetch(
      `${process.env.API_URL_STAGING}institutions/${this.props.id}/${connectionType}/${etablissement_id}`,
      {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')})`,
        }),
      },
    )
      .then(res => res.json())
      .then(() => {
        this.setState({
          isDeleting: false,
        });
        this.props.getConnections(this.props.id, connectionType);
      });
  }


  renderMothersTableRows() {
    if (this.props.mothers.length > 0) {
      return this.props.mothers.map(mother =>
        (
          <ModalRow
            key={mother.connection.id}
            category={mother.connection.category}
            date={mother.connection.date}
            deleteMethod={this.deleteConnection}
            id={this.props.id}
            etablissement={mother.mother.name}
            etablissement_id={mother.mother.id}
            categoryType="mothers"
          />));
    }
    return '';
  }

  renderDaughtersTableRows() {
    if (this.props.daughters.length > 0) {
      return this.props.daughters.map(daughter =>
        (
          <ModalRow
            key={daughter.connection.id}
            category={daughter.connection.category}
            date={daughter.connection.date}
            deleteMethod={this.deleteConnection}
            id={this.props.id}
            etablissement={daughter.daughter.name}
            etablissement_id={daughter.daughter.id}
            categoryType="daughters"
          />));
    }
    return '';
  }

  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          Rattachements de l&#39;établissement
        </ModalHeader>
        <ModalBody>
          {this.props.mothers.length > 0 ?
            <div>
              <h5>Etablissements mères</h5>
              <Table hover bordered striped responsive size="sm">
                <thead>
                  <tr>
                    <th>Etablissement</th>
                    <th>Catégorie de rattachement</th>
                    <th>Date</th>
                    <th>Action </th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderMothersTableRows()}
                </tbody>
              </Table>
            </div> : <div />}
          {this.props.daughters.length > 0 ?
            <div>
              <h5>Etablissements filles</h5>
              <Table hover bordered striped responsive size="sm">
                <thead>
                  <tr>
                    <th>Etablissement</th>
                    <th>Catégorie de rattachement</th>
                    <th>Date</th>
                    <th>Action </th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderDaughtersTableRows()}
                </tbody>
              </Table>
            </div> : <div />}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.toggle}>Fermer</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

ConnectionsModal.propTypes = {
  daughters: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired,
  getConnections: PropTypes.func.isRequired,
  mothers: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default ConnectionsModal;
