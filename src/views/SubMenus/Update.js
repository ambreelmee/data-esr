import React from 'react';
import { Alert, Row } from 'reactstrap';
import PropTypes from 'prop-types';


const Update = (props) => {
  return (
    <div className="animated fadeIn p-5">
      <h2 className="text-center">
        Gestion des <span className="text-primary"><strong>mises à jour </strong></span>
        des établissements
      </h2>
      <Alert className="m-5" color="success">Aucune mise à jour pour le moment !</Alert>
    </div>);
};

Update.propTypes = {
  categoryType: PropTypes.string,
};

Update.defaultProps = {
  categoryType: null,
};

export default Update;
