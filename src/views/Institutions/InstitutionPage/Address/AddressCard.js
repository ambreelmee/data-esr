import React from 'react';
import {
  Button, ButtonGroup, ButtonDropdown, Card, CardBody, CardHeader,
  DropdownMenu, DropdownToggle,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Address from './Address';


const AddressCard = props => (
  <Card className="mb-0 mt-2 w-100">
    <CardHeader>
      Adresse de l&#39;établissement
      <ButtonGroup className="float-right">
        <ButtonDropdown
          isOpen={props.dropdown}
          toggle={props.displayDropdown}
        >
          <DropdownToggle id="addressDropdown" caret className="p-0" color="light">
            <i id="addressDropdown" className="icon-settings" />
          </DropdownToggle>
          <DropdownMenu>
            <NavLink to={`/etablissements/${props.institutionId}/adresses`} className="dropdown-item" >
              <i className="fa fa-arrow-right text-info" />
                Gérer les adresses
            </NavLink>
          </DropdownMenu>
        </ButtonDropdown>
      </ButtonGroup>
    </CardHeader>
    {props.displayedAddress ?
      <CardBody>
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
        />
      </CardBody> :
      <CardBody>
        <em>Aucune adresse enregistrée actuellement...</em>
        <Button color="primary" size="sm" className="float-right rounded" onClick={props.toggleAddModal}>
          <i className="fa fa-plus mr-1" />
          Ajouter une addresse
        </Button>
      </CardBody>}
  </Card>
);

AddressCard.propTypes = {
  displayedAddress: PropTypes.object,
  dropdown: PropTypes.bool.isRequired,
  displayDropdown: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  institutionId: PropTypes.number.isRequired,
  toggleAddModal: PropTypes.func.isRequired,
};



export default AddressCard;
