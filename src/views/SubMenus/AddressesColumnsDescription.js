import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

const AddressesColumnsDescription = () => (
  <ListGroup className="d-inline-block">
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-secondary m-0"><strong>ID</strong></h6>
      <div className="ml-2">
        identifiant interne pour modifier ou supprimer l&#39;adresse
      </div>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-primary m-0"><strong>InsitutionID</strong></h6>
      <div className="ml-2">
        identifiant interne utilisé pour désigner l&#39;établissement
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
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-secondary m-0"><strong>DateFermeture</strong></h6>
      <div className="ml-2">date de fin de validité</div>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-secondary m-0"><strong>Status</strong></h6>
      <div className="ml-2">active (actif) ou archived (archivé)</div>
    </ListGroupItem>
    <ListGroupItem className="d-flex align-items-center">
      <h6 className="text-secondary m-0"><strong>CityCode</strong></h6>
      <div className="ml-2">Code commune</div>
    </ListGroupItem>
  </ListGroup>);


export default AddressesColumnsDescription;
