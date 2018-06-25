import React, { Component } from 'react';
import { Alert, CardBody, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import map from 'lodash/map';

class ResourceConflictContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  renderTable() {
    return map(this.props.current, (fieldValue, fieldName) => {
      const matchingConflict = this.props.conflict.find(item => item.field_name === fieldName);
      console.log(matchingConflict)
      return (
        <tr key={fieldName}>
          <td>{fieldName}</td>
          <td>{fieldValue}</td>
          <td>{matchingConflict ? matchingConflict.new_value : ''}</td>
        </tr>);
    });
  }

  render() {
    if (this.state.isLoading) {
      return <p />;
    }
    if (this.state.error) {
      return <Alert color="danger">Impossible de charger les données. Veuillez réessayer ultérieurement </Alert>;
    }
    return (
      <CardBody>
        <h5>{this.props.resource}</h5>
        <Table hover striped responsive size="sm">
          <thead>
            <tr>
              <th>Champ</th>
              <th>Valeur actuelle</th>
              <th>Nouvelle valeur</th>
            </tr>
          </thead>
          <tbody>
            {this.renderTable()}
          </tbody>
        </Table>
      </CardBody>);
  }
}

ResourceConflictContainer.propTypes = {
  conflict: PropTypes.array.isRequired,
  current: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  resource: PropTypes.string.isRequired,
};


export default ResourceConflictContainer;
