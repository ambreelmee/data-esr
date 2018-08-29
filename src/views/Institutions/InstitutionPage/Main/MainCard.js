import React from 'react';
import { Alert, ButtonGroup, ButtonDropdown, Card, Col, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import SynonymBox from './SynonymBox';

const e = document.documentElement;
const g = document.getElementsByTagName('body')[0];
const width = window.innerWidth || e.clientWidth || g.clientWidth;

const MainCard = props => (
  <div className="w-100">
    <Card className="mb-0 mt-2 rounded bg-transparent border-0" style={{ height: '250px' }}>
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
    <Alert className="rounded mb-0" color={props.dateEnd ? 'danger' : 'success'}>
      <div className="text-center" >
        {props.dateEnd ?
          `Cet établissement est fermé depuis le ${moment(props.dateEnd).format('LL')}` :
          `Cet établissement est ouvert depuis le ${moment(props.dateStart).format('LL')}`}<br />
      </div>
      <Row>
        {props.predecessors.length > 0 ?
          <Col md="6">
            <strong>Prédecesseur(s) ({props.predecessors[0].evolution.category})</strong> :<br />
            {props.predecessors.map(predecessor => (
              <NavLink key={predecessor.predecessor.id} to={`/etablissements/${predecessor.predecessor.id}`}>
                {predecessor.predecessor.name}<br />
              </NavLink>))}
          </Col> : <div />}
        {props.followers.length > 0 ?
          <Col md="6">
            <strong>Successeur(s) ({props.followers[0].evolution.category})</strong> :<br />
            {props.followers.map(follower => (
              <NavLink key={follower.follower.id} to={`/etablissements/${follower.follower.id}`}>
                {follower.follower.name}<br />
              </NavLink>))}
          </Col> : <div />}
      </Row>
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
            <NavLink to={`/etablissements/${props.institutionId}/noms`} className="dropdown-item" >
              <i className="fa fa-arrow-right text-info" />
                Gérer les noms
            </NavLink>
            <NavLink to={`/etablissements/${props.institutionId}/evolutions`} className="dropdown-item" >
              <i className="fa fa-arrow-right text-info" />
                Gérer les évolutions
            </NavLink>
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
    </Alert>
  </div>
);

MainCard.propTypes = {
  dateEnd: PropTypes.string,
  dateStart: PropTypes.string.isRequired,
  dropdown: PropTypes.bool.isRequired,
  displayDropdown: PropTypes.func.isRequired,
  followers: PropTypes.array,
  initials: PropTypes.string.isRequired,
  institutionId: PropTypes.number.isRequired,
  predecessors: PropTypes.array,
  synonym: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  toggleStatusModal: PropTypes.func.isRequired,
  toggleSynonymModal: PropTypes.func.isRequired,
};

MainCard.defaultProps = {
  dateEnd: '',
  followers: [],
  predecessors: [],
};


export default MainCard;
