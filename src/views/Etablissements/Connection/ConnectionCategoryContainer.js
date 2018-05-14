import React, { Component } from 'react';
import { Col, Button, Row } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

class ConnectionCategoryContainer extends Component {
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

  renderConnections(connectionsList) {
    return connectionsList.map(connection => (
      <Button
        style={{ whiteSpace: 'normal' }}
        color="light"
        key={`connection-${connection.id}`}
        id={connection.id}
        onClick={this.redirectToInstitution}
      >
        {connection.name}
      </Button>
    ));
  }

  render() {
    if (this.state.redirectToInstitution) {
      return <Redirect to={`/etablissements/${this.state.selectedInstitution}`} />;
    }
    return (
      <Row className="border-top py-1">
        <Col xs="3" className="mx-auto">
          <div className="text-primary"><strong>{this.props.category}</strong></div>
        </Col>
        <Col xs="4" className="mx-auto px-0">
          {this.renderConnections(this.props.mothers)}
        </Col>
        <Col xs="4" className="mx-auto px-0">
          {this.renderConnections(this.props.daughters)}
        </Col>
      </Row>
    );
  }
}

ConnectionCategoryContainer.propTypes = {
  category: PropTypes.string.isRequired,
  daughters: PropTypes.array.isRequired,
  mothers: PropTypes.array.isRequired,
};

export default ConnectionCategoryContainer;
