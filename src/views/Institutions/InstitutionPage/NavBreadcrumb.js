import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavBreadcrumb = props => (
  <Breadcrumb tag="nav">
    <BreadcrumbItem tag="a">
      <NavLink to="/etablissements">
        Etablissements
      </NavLink>
    </BreadcrumbItem>
    <BreadcrumbItem tag="a">
      <NavLink to={`/etablissements/${props.institutionId}`}>
        {props.displayedName}
      </NavLink>
    </BreadcrumbItem>
    <BreadcrumbItem tag="a">
      {props.type}
    </BreadcrumbItem>
  </Breadcrumb>
);


NavBreadcrumb.propTypes = {
  institutionId: PropTypes.number.isRequired,
  displayedName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};


export default NavBreadcrumb;
