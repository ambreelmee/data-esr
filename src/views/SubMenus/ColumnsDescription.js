import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';


const ColumnsDescription = props => (
  <ListGroup className="d-inline-block">
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-secondary m-0"><strong>ID</strong></h6>
      <div className="ml-2">
        identifiant interne utilisé pour modifier ou supprimer le contenu du {props.singularName}
      </div>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-primary m-0"><strong>InsitutionID</strong></h6>
      <div className="ml-2">
        identifiant interne utilisé pour désigner l&#39;établissement
      </div>
    </ListGroupItem>
    {props.singularName === 'caracterisation' ?
      <ListGroupItem className="d-flex align-items-center">
        <h6 className="text-primary m-0">
          <strong>TagCategoryID</strong>
        </h6>
        <div className="ml-2">
          identifiant du tag appliqué à l&#39;établissement
        </div>
      </ListGroupItem> :
      <ListGroupItem className="d-flex align-items-center">
        <h6 className="text-primary m-0">
          <strong>{props.routePath}CategoryID</strong>
        </h6>
        <div className="ml-2">
          identifiant du type de {props.singularName}
        </div>
      </ListGroupItem>}
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-secondary m-0"><strong>DateCreation</strong></h6>
      {props.singularName === 'lien' ?
        <div className="ml-2">
          non utilisé
        </div> :
        <div className="ml-2">
          date de début de validité
        </div>}
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-secondary m-0"><strong>DateFermeture</strong></h6>
      {props.singularName === 'lien' ?
        <div className="ml-2">
          non utilisé
        </div> :
        <div className="ml-2">
          date de fin de validité
        </div>}
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-secondary m-0"><strong>Status</strong></h6>
      {props.singularName === 'lien' ?
        <div className="ml-2">
          toujours active (actif)
        </div> :
        <div className="ml-2">
          active (actif) ou archived (archivé)
        </div>}
    </ListGroupItem>
  </ListGroup>);

ColumnsDescription.propTypes = {
  routePath: PropTypes.string.isRequired,
  singularName: PropTypes.string.isRequired,
};


export default ColumnsDescription;
