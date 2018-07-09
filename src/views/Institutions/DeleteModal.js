import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';

const DeleteModal = props => (
  <Modal isOpen={props.modal} toggle={props.toggleModal} color="danger">
    <ModalHeader toggle={props.toggleModal}>
      Suppression du champ
    </ModalHeader>
    <ModalBody>
      Etes-vous sûr de vouloir supprimer ce champ ?
    </ModalBody>
    <ModalFooter>
      {props.hasErrored ?
        <p className="mt-2 text-danger">Une erreur est survenue</p> : <div />}
      <Button
        className="m-1 float-right"
        color="danger"
        disabled={props.isLoading}
        onClick={!props.isLoading ? props.deleteMethod : null}
      >
        {props.isLoading ?
          <div>
            <i className="fa fa-spinner fa-spin " />
            <span className="mx-1"> Suppression </span>
          </div> : <div />}
        Supprimer
      </Button>
      <Button color="secondary" onClick={props.toggleModal}>Annuler</Button>
    </ModalFooter>
  </Modal>
);


DeleteModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  hasErrored: PropTypes.bool,
  modal: PropTypes.bool,
  deleteMethod: PropTypes.func.isRequired,
};

DeleteModal.defaultProps = {
  modal: true,
  hasErrored: false,
  isLoading: false,
};

export default DeleteModal;
