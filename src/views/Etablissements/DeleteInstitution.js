import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';


class DeleteInstitution extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: '',
      isDeleting: false,
      modal: false,
      redirectToSearchPage: false,
    };
    this.deleteInstitution = this.deleteInstitution.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  deleteInstitution() {
    const institution = {
      is_institution: false,
      id_esr: this.props.id,
    };
    this.setState({ isDeleting: true });
    fetch(`${process.env.API_BCE_URL}institutions/${this.props.uai}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify(institution),
    })
      .then((response) => {
        if (response.ok) {
          this.setState({
            isDeleting: false,
            redirectToSearchPage: true,
          });
        } else {
          this.setState({
            errorMessage: "une erreur s'est produite",
            isDeleting: false,
          });
        }
      });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    if (this.state.redirectToSearchPage) {
      return <Redirect to="/etablissements" />;
    }
    return (
      <div>
        <Button
          color="danger"
          className="mt-2 mb-4"
          size="lg"
          onClick={this.toggleModal}
        >
        Supprimer
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} color="danger">
          <ModalHeader toggle={this.toggleModal}>
            Suppression d&#39;un établissement
          </ModalHeader>
          <ModalBody>
            <p className="text-danger">Etes-vous sûr de vouloir supprimer cet établissement ?</p><br />
            Toutes les données liées à cet établissement seront perdues et les mises à jour
            automatiques avec le référentiel de la BCE ne sera plus assurée.<br />
            Si vous souhaitez seulement déclarer l&#39;établissement comme <strong>fermé</strong>,
             modifiez le bloc qui indique la date d&#39;ouverture à gauche du bouton supprimer
          </ModalBody>
          <ModalFooter>
            <p className="mt-2 text-danger">{this.state.errorMessage}</p>
            <Button
              className="m-1 float-right"
              color="danger"
              disabled={this.state.isDeleting}
              onClick={!this.state.isDeleting ? this.deleteInstitution : null}
            >
              {this.state.isDeleting ?
                <div>
                  <i className="fa fa-spinner fa-spin " />
                  <span className="mx-1"> Suppression </span>
                </div> : <div />}
              Supprimer
            </Button>
            <Button color="secondary" onClick={this.toggleModal}>Annuler</Button>
          </ModalFooter>
        </Modal>
      </div>

    );
  }
}

DeleteInstitution.propTypes = {
  id: PropTypes.number.isRequired,
  uai: PropTypes.string,
};

DeleteInstitution.defaultProps = {
  uai: null,
};

export default DeleteInstitution;
