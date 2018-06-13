import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';


class ModalRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteTooltip: false,
      deleteModal: false,
    };
    this.deleteRelation = this.deleteRelation.bind(this);
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

  deleteRelation() {
    this.setState({ isDeleting: true });
    fetch(
      `${process.env.API_URL_STAGING}institutions/` +
      `${this.props.id}/${this.props.relationDirection}/${this.props.relationInstitutionId}`,
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
        this.props.getRelations(this.props.id, this.props.relationDirection);
      });
  }


  render() {
    return (
      <tr key={this.props.relationInstitutionId}>
        <td>{this.props.etablissement}</td>
        <td>{this.props.category}</td>
        <td>{this.props.date ? moment(this.props.date).format('LL') : ''}</td>
        <td>
          <Button
            color="danger"
            id={`evolutionsmodal-delete-button-${this.props.relationInstitutionId}`}
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
                  onClick={!this.state.isDeleting ? this.deleteRelation : null}
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
            target={`evolutionsmodal-delete-button-${this.props.relationInstitutionId}`}
            toggle={this.toggleDeleteToolTip}
          >
          Supprimer la référence
          </Tooltip>
        </td>
      </tr>);
  }
}

ModalRow.propTypes = {
  id: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  date: PropTypes.string,
  etablissement: PropTypes.string.isRequired,
  getRelations: PropTypes.func.isRequired,
  relationInstitutionId: PropTypes.number.isRequired,
  relationDirection: PropTypes.string.isRequired,
};

ModalRow.defaultProps = {
  date: '',
};

export default ModalRow;
