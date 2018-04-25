import React from 'react';
import { Col, Row } from 'reactstrap';
import PropTypes from 'prop-types';

const ConnectionCategoryContainer = (props) => {
  const renderMothers = () => (
    props.mothers.map(mother => (
      <div key={mother.id}>{mother.name}</div>
    )));
  const renderDaughters = () => (
    props.daughters.map(daughter => (
      <div key={daughter.id}>{daughter.name}</div>
    )));

  return (
    <Row className="border-top py-1">
      <Col xs="3" className="mx-auto">
        <div className="text-primary"><strong>{props.category}</strong></div>
      </Col>
      <Col xs="4" className="mx-auto">
        {renderMothers()}
      </Col>
      <Col xs="4" className="mx-auto">
        {renderDaughters()}
      </Col>
    </Row>
  );
};

ConnectionCategoryContainer.propTypes = {
  category: PropTypes.string.isRequired,
  daughters: PropTypes.array.isRequired,
  mothers: PropTypes.array.isRequired,
};

export default ConnectionCategoryContainer;
