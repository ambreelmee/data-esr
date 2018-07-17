import React from 'react';
import { Alert, ButtonGroup, ButtonDropdown, Card, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import SynonymBox from './SynonymBox';

const e = document.documentElement;
const g = document.getElementsByTagName('body')[0];
const width = window.innerWidth || e.clientWidth || g.clientWidth;

const NameCard = props => (
  <Card className="mb-0 mt-2 w-100 text-center" style={{ height: '175px' }}>
    <Alert color={props.dateEnd ? 'danger' : 'success'}>
      {props.dateEnd ?
        `Cet établissement est fermé depuis le ${moment(props.dateEnd).format('LL')}` :
        `Cet établissement est ouvert depuis le ${moment(props.dateStart).format('LL')}`}
    </Alert>

    <ButtonGroup style={{ position: 'absolute', right: '10px', top: '5px' }}>
      <ButtonDropdown
        id="nameDropdown"
        isOpen={props.dropdown}
        toggle={props.displayDropdown}
      >
        <DropdownToggle caret className="p-0 text-dark" color="transparent">
          <i className="icon-settings" />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={props.toggleTableModal}>
            <i className="fa fa-eye text-info" />
              Afficher les informations détaillées
          </DropdownItem>
          <DropdownItem onClick={props.toggleSynonymModal}>
            <i className="fa fa-edit text-warning" />
              Modifier la liste des noms d&#39;usage
          </DropdownItem>
          <DropdownItem onClick={props.toggleStatusModal}>
            <i className="fa fa-pencil text-danger" />
              Modifier le statut de l&#39;établissement
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    </ButtonGroup>
    {width > 767 ?
      <SynonymBox
        initials={props.initials}
        text={props.text}
        synonym={props.synonym}
      /> :
      <div>
        <h3>{props.initials}</h3>
        <h4>{props.text}</h4>
      </div>}
  </Card>
);

NameCard.propTypes = {
  dateEnd: PropTypes.string,
  dateStart: PropTypes.string.isRequired,
  dropdown: PropTypes.bool.isRequired,
  displayDropdown: PropTypes.func.isRequired,
  initials: PropTypes.string.isRequired,
  synonym: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  toggleStatusModal: PropTypes.func.isRequired,
  toggleSynonymModal: PropTypes.func.isRequired,
  toggleTableModal: PropTypes.func.isRequired,
};

NameCard.defaultProps = {
  dateEnd: '',
};


export default NameCard;
