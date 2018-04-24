import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';


class EvolutionsModalRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteTooltip: false,
      deleteModal: false,
    };
    this.deleteEvolution = this.deleteEvolution.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleDeleteToolTip = this.toggleDeleteToolTip.bind(this);
  }

  toggleDeleteToolTip() {
    this.setState({
      deleteTooltip: !this.state.deleteTooltip,
    });
  }

  toggleDeleteModal() {
    this.setState({
      deleteModal: !this.state.deleteModal,
    });
  }


  deleteEvolution() {
    this.setState({ isDeleting: true });
    fetch(
      `${process.env.API_URL_STAGING}institutions/${this.props.id}/${this.props.evolutionType}/${this.props.etablissement_id}`,
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


  render() {
    return (
      <tr key={this.props.etablissement_id}>
        <td>{this.props.etablissement}</td>
        <td>{this.props.category}</td>
        <td>{this.props.date ? moment(this.props.date).format('LL') : ''}</td>
        <td className="d-flex flex-row">
          <Button
            color="danger"
            id={`evolutionsmodal-delete-button-${this.props.etablissement_id}`}
            onClick={this.toggleDeleteModal}
            size="sm"
          >
            <i className="fa fa-close" />
          </Button>
          {this.state.deleteModal ?
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
                  onClick={!this.state.isDeleting ? this.deleteEvolution : null}
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
            </Modal> : <div />}
          <Tooltip
            placement="bottom"
            isOpen={this.state.deleteTooltip}
            target={`evolutionsmodal-delete-button-${this.props.etablissement_id}`}
            toggle={this.toggleDeleteToolTip}
          >
          Supprimer la référence
          </Tooltip>
        </td>
      </tr>);
  }
}

EvolutionsModalRow.propTypes = {
  id: PropTypes.number.isRequired,
  etablissement: PropTypes.string.isRequired,
  etablissement_id: PropTypes.number.isRequired,
  evolutionType: PropTypes.string.isRequired,
  date: PropTypes.string,
  getInstitutionEvolution: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
};

EvolutionsModalRow.defaultProps = {
  date: '',
};

export default EvolutionsModalRow;
