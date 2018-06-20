import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

const InstitutionsColumnsDescription = () => (
  <ListGroup className="d-inline-block">
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-primary m-0"><strong>Numéro UAI</strong></h6>
      <div className="ml-2">
        Le numéro UAI auquel l&#39;établissement doit être rattaché
      </div>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-primary m-0"><strong>NomEtablissement</strong></h6>
      <div className="ml-2">
        Le nom de l&#39;établissement
      </div>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-primary m-0"><strong>SigleEtablissement</strong></h6>
      <div className="ml-2">
        Le nom court de l&#39;établissement (min 2 caractères)
      </div>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-secondary m-0"><strong>BusinessName</strong></h6>
      <div className="ml-2">
        Nom ou raison sociale
      </div>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-primary m-0"><strong>Addresse1</strong></h6>
      <div className="ml-2">
        Champ d&#39;adresse principal
      </div>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-secondary m-0"><strong>Addresse2</strong></h6>
      <div className="ml-2">
        Champ d&#39;adresse secondaire
      </div>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-primary m-0"><strong>CodePostal</strong></h6>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-primary m-0"><strong>Ville</strong></h6>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-primary m-0"><strong>Pays</strong></h6>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-secondary m-0"><strong>Téléphone</strong></h6>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-primary m-0"><strong>DateCreation</strong></h6>
      <div className="ml-2">date de début de validité</div>
    </ListGroupItem>
  </ListGroup>);


export default InstitutionsColumnsDescription;
