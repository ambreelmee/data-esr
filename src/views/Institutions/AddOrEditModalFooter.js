import React from 'react';
import { Button, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';

const AddOrEditModalFooter = props => (
  <ModalFooter>
    <p className="mt-2 text-danger">
      {props.hasErrored ?
        'Opération impossible, veuillez vérifier que le formulaire est bien complet' : ''}
    </p>
    <Button
      className="m-1 float-right"
      color="primary"
      disabled={props.isLoading}
      onClick={!props.isLoading ? props.triggerAction : null}
    >
      {props.isLoading ?
        <div>
          <i className="fa fa-spinner fa-spin " />
          <span className="mx-1"> Modification </span>
        </div> :
        <div>
          {props.message}
        </div>}
    </Button>
    <Button color="secondary" onClick={props.toggleModal}>Annuler</Button>
  </ModalFooter>
);


AddOrEditModalFooter.propTypes = {
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired,
  triggerAction: PropTypes.func.isRequired,
};

export default AddOrEditModalFooter;
