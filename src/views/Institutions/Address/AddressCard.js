import React from 'react';
import {
  Button, ButtonGroup, ButtonDropdown, Card, CardBody, CardHeader,
  DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import PropTypes from 'prop-types';
import Address from './Address';


const AddressCard = props => (
  <Card className="mb-0 mt-2 w-100">
    <CardHeader>
      Adresse de l&#39;établissement
      <ButtonGroup className="float-right">
        <ButtonDropdown
          id="nameDropdown"
          isOpen={props.dropdown}
          toggle={props.displayDropdown}
        >
          <DropdownToggle caret className="p-0" color="light">
            <i className="icon-settings" />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={props.toggleTableModal}>
              <i className="fa fa-eye text-info" />
                Afficher les informations détaillées
            </DropdownItem>
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
  toggleAddModal: PropTypes.func.isRequired,
  toggleTableModal: PropTypes.func.isRequired,
};



export default AddressCard;
