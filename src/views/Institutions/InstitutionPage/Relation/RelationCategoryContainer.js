import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

class RelationCategoryContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToInstitution: false,
      selectedInstitution: null,
    };
    this.redirectToInstitution = this.redirectToInstitution.bind(this);
  }

  redirectToInstitution(event) {
    this.setState({
      redirectToInstitution: true,
      selectedInstitution: event.target.id,
    });
  }

  renderRelations(relationList) {
    return relationList.map(relation => (
      <NavLink
        key={`relation-${relation.id}`}
        className="btn btn-light"
        to={`/etablissements/${relation.id}`}
        style={{ whiteSpace: 'normal' }}
      >
        {relation.name}
      </NavLink>
    ));
  }

  render() {
    return (
      <Row className="border-top py-1">
        <Col xs="3" className="mx-auto">
          <div className="text-primary"><strong>{this.props.category}</strong></div>
        </Col>
        <Col xs="4" className="mx-auto px-0">
          {this.renderRelations(this.props.relationUp)}
        </Col>
        <Col xs="4" className="mx-auto px-0">
          {this.renderRelations(this.props.relationDown)}
        </Col>
      </Row>
    );
  }
}

RelationCategoryContainer.propTypes = {
  category: PropTypes.string.isRequired,
  relationDown: PropTypes.array.isRequired,
  relationUp: PropTypes.array.isRequired,
};

export default RelationCategoryContainer;
