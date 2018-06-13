import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';
import PropTypes from 'prop-types';

import RelationModalRow from './RelationModalRow';


class EvolutionsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: true,
    };
    this.toggle = this.toggle.bind(this);
    this.deleteEvolution = this.deleteEvolution.bind(this);
  }

  toggle() {
    this.props.toggleModal();
    this.setState({
      modal: !this.state.modal,
    });
  }

  deleteEvolution(etablissement_id, evolutionType) {
    this.setState({ isDeleting: true });
    fetch(
      `${process.env.API_URL_STAGING}institutions/${this.props.id}/${evolutionType}/${etablissement_id}`,
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
        this.props.getInstitutionEvolution(this.props.id);
      });
  }



  renderPredecessorsTableRows() {
    if (this.props.predecessors.length > 0) {
      return this.props.predecessors.map(predecessor =>
        (
          <RelationModalRow
            key={predecessor.evolution.id}
            category={predecessor.evolution.category}
            date={predecessor.evolution.date}
            deleteMethod={this.deleteEvolution}
            id={this.props.id}
            etablissement={predecessor.predecessor.name}
            etablissement_id={predecessor.predecessor.id}
            categoryType="predecessors"
          />));
    }
    return '';
  }

  renderFollowersTableRows() {
    if (this.props.followers.length > 0) {
      return this.props.followers.map(follower =>
        (
          <RelationModalRow
            key={follower.evolution.id}
            category={follower.evolution.category}
            date={follower.evolution.date}
            deleteMethod={this.deleteEvolution}
            id={this.props.id}
            etablissement={follower.follower.name}
            etablissement_id={follower.follower.id}
            categoryType="followers"
          />));
    }
    return '';
  }

  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          Evolutions lié à l&#39;établissement
        </ModalHeader>
        <ModalBody>
          {this.props.predecessors.length > 0 ?
            <div>
              <h5>Prédécesseurs</h5>
              <Table hover bordered striped responsive size="sm">
                <thead>
                  <tr>
                    <th>Etablissement</th>
                    <th>Catégorie d&#39;évolution</th>
                    <th>Date</th>
                    <th>Action </th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderPredecessorsTableRows()}
                </tbody>
              </Table>
            </div> : <div />}
          {this.props.followers.length > 0 ?
            <div>
              <h5>Successeurs</h5>
              <Table hover bordered striped responsive size="sm">
                <thead>
                  <tr>
                    <th>Etablissement</th>
                    <th>Catégorie d&#39;évolution</th>
                    <th>Date</th>
                    <th>Action </th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderFollowersTableRows()}
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

EvolutionsModal.propTypes = {
  id: PropTypes.number.isRequired,
  followers: PropTypes.array.isRequired,
  predecessors: PropTypes.array.isRequired,
  getInstitutionEvolution: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default EvolutionsModal;
