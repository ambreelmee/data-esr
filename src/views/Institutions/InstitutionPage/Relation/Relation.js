import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const Relation = props => (
  <div>
    établissement :
    <NavLink to={`/etablissements/${props.institutionEvolutionId}`}>
      &nbsp;{props.institutionEvolutionName}
    </NavLink> <br />
    catégorie : {props.category}<br />
    {props.date ? `date : ${props.date}` : ''}
  </div>
);

Relation.propTypes = {
  category: PropTypes.string.isRequired,
  date: PropTypes.string,
  institutionEvolutionId: PropTypes.number.isRequired,
  institutionEvolutionName: PropTypes.string.isRequired,
};

Relation.defaultProps = {
  date: '',
};

export default Relation;
