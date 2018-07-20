import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';
import PropTypes from 'prop-types';

import RelationModalRow from './RelationModalRow';


class RelationModal extends Component {
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




  renderMothersTableRows() {
    if (this.props.mothers.length > 0) {
      return this.props.mothers.map(mother =>
        (
          <RelationModalRow
            key={mother.connection.id}
            category={mother.connection.category}
            date={mother.connection.date}
            getRelations={this.props.getRelations}
            id={this.props.id}
            etablissement={mother.mother.name}
            relationInstitutionId={mother.mother.id}
            relationDirection="mothers"
            toggle={this.toggle}
          />));
    }
    return '';
  }

  renderDaughtersTableRows() {
    if (this.props.daughters.length > 0) {
      return this.props.daughters.map(daughter =>
        (
          <RelationModalRow
            key={daughter.connection.id}
            category={daughter.connection.category}
            date={daughter.connection.date}
            getRelations={this.props.getRelations}
            id={this.props.id}
            etablissement={daughter.daughter.name}
            relationInstitutionId={daughter.daughter.id}
            relationDirection="daughters"
            toggle={this.toggle}
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

RelationModal.propTypes = {
  daughters: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired,
  getRelations: PropTypes.func.isRequired,
  mothers: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default RelationModal;
