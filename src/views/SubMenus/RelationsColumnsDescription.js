import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';


const RelationsColumnsDescription = props => (
  <ListGroup className="d-inline-block">
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-secondary m-0"><strong>ID</strong></h6>
      <div className="ml-2">
        identifiant interne utilisé pour modifier ou supprimer le contenu du {props.singularName}
      </div>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-primary m-0"><strong>{props.relationUp}</strong></h6>
      <div className="ml-2">
        identifiant désignant l&#39;établissement {props.relationUp}
      </div>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-primary m-0"><strong>{props.relationDown}</strong></h6>
      <div className="ml-2">
        identifiant désignant l&#39;établissement {props.relationDown}
      </div>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-primary m-0">
        <strong>{props.routePath}CategoryID</strong>
      </h6>
      <div className="ml-2">
        identifiant du type de {props.singularName}
      </div>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-secondary m-0"><strong>Date</strong></h6>
      <div className="ml-2">
        Date de {props.singularName}
      </div>
    </ListGroupItem>
  </ListGroup>);

RelationsColumnsDescription.propTypes = {
  relationDown: PropTypes.string.isRequired,
  relationUp: PropTypes.string.isRequired,
  routePath: PropTypes.string.isRequired,
  singularName: PropTypes.string.isRequired,
};


export default RelationsColumnsDescription;
