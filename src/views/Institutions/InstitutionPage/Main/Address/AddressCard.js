import React from 'react';
import { Button, ButtonGroup, ButtonDropdown, Alert, DropdownMenu, DropdownToggle } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Address from './Address';


const AddressCard = props => (
  <Alert color="secondary" className="mb-0 w-100 rounded">
    <ButtonGroup className="float-right">
      <ButtonDropdown
        isOpen={props.dropdown}
        toggle={props.displayDropdown}
      >
        <DropdownToggle id="addressDropdown" caret className="p-0" color="light">
          <i id="addressDropdown" className="icon-settings" />
        </DropdownToggle>
        <DropdownMenu className="rounded">
          <NavLink to={`/etablissements/${props.institutionId}/adresses`} className="dropdown-item rounded alert-secondary" >
            <i className="fa fa-arrow-right text-info" />
              Gérer les adresses
          </NavLink>
        </DropdownMenu>
      </ButtonDropdown>
    </ButtonGroup>
    {props.displayedAddress ?
      <Address
        address_1={props.displayedAddress.address_1}
        address_2={props.displayedAddress.address_2}
        business_name={props.displayedAddress.business_name}
        city={props.displayedAddress.city}
        city_code={props.displayedAddress.city_code}
        id={props.displayedAddress.id}
        phone={props.displayedAddress.phone}
        status={props.displayedAddress.status}
        zip_code={props.displayedAddress.zip_code}
      /> :
      <div>
        <em>Aucune adresse enregistrée actuellement...</em>
        <Button color="primary" size="sm" className="float-right rounded" onClick={props.toggleAddModal}>
          <i className="fa fa-plus mr-1" />
          Ajouter une addresse
        </Button>
      </div>}
  </Alert>
);

AddressCard.propTypes = {
  displayedAddress: PropTypes.object,
  dropdown: PropTypes.bool.isRequired,
  displayDropdown: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  institutionId: PropTypes.number.isRequired,
};



export default AddressCard;
