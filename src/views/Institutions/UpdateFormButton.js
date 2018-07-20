import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

const UpdateFormButton = props => (
  <div>
    <Button
      className="float-right rounded"
      color={props.color}
      disabled={props.isLoading}
      onClick={!props.isLoading ? props.triggerAction : null}
    >
      {props.isLoading ?
        <div>
          <i className="fa fa-spinner fa-spin " />
          <span className="mx-1"> Chargement </span>
        </div> :
        <div>
          {props.message}
        </div>}
    </Button>
    <p className="mt-2 text-danger">
      {props.hasErrored ?
        'Opération impossible, veuillez vérifier que le formulaire est bien complet' : ''}
    </p>
  </div>
);


UpdateFormButton.propTypes = {
  color: PropTypes.string.isRequired,
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  triggerAction: PropTypes.func.isRequired,
};

export default UpdateFormButton;
