import React, { Component } from 'react';
import { Alert, Card, CardHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import { Redirect } from 'react-router-dom';
import { getActiveEntity } from '../../Etablissements/methods';
import ResourceConflictTable from './ResourceConflictTable';

class InstitutionConflictContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      institution: {},
      isLoading: false,
      redirectToInstitution: false,
    };
    this.redirectToInstitution = this.redirectToInstitution.bind(this);
  }

  componentWillMount() {
    this.getInstitution();
  }

  getInstitution() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${this.props.id}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            this.setState({
              institution: data.institution,
              isLoading: false,
            });
          });
        } else {
          this.setState({
            error: true,
            isLoading: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          error: true,
          isLoading: false,
        });
      });
  }

  redirectToInstitution() {
    this.setState({ redirectToInstitution: true });
  }

  renderResources() {
    return map(this.state.institution, (currentValues, resourceName) => {
      const resourceMatchingConflict = this.props[resourceName];
      if (resourceMatchingConflict && resourceMatchingConflict.length > 0) {
        if (typeof currentValues === 'string') {
          return (
            <ResourceConflictTable
              id={currentValues}
              key={currentValues}
              conflict={resourceMatchingConflict}
              current={currentValues}
              resource={resourceName}
            />);
        }
        if (currentValues === null) {
          return (
            <ResourceConflictTable
              id_etablissement={this.props.id}
              key={resourceMatchingConflict[0].field_name}
              conflict={resourceMatchingConflict}
              current="null"
              resource={resourceName}
            />);
        }
        const hasCategory = Boolean(resourceMatchingConflict[0].category);
        if (hasCategory) {
          return currentValues.filter(currentValue => currentValue.status === 'active')
            .map((currentValue) => {
              const categoryMatchingConflict = resourceMatchingConflict.filter(conflict => (
                conflict.category === currentValue.category));
              if (categoryMatchingConflict.length > 0) {
                return (
                  <ResourceConflictTable
                    id={currentValue.id}
                    id_etablissement={this.props.id}
                    key={currentValue.id}
                    category={currentValue.category}
                    conflict={categoryMatchingConflict}
                    current={currentValue}
                    resource={resourceName}
                  />);
              }
            });
        }
        const CurrentValue = getActiveEntity(currentValues);
        return (
          <ResourceConflictTable
            id={CurrentValue.id}
            id_etablissement={this.props.id}
            key={CurrentValue.id}
            conflict={resourceMatchingConflict}
            current={CurrentValue}
            resource={resourceName}
          />);
      }
    });
  }


  render() {
    if (this.state.isLoading) {
      return <p />;
    }
    if (this.state.redirectToInstitution) {
      return <Redirect to={`/etablissements/${this.props.id}`} />;
    }
    if (this.state.error) {
      return <Alert color="danger">Impossible de charger les données. Veuillez réessayer ultérieurement </Alert>;
    }
    const name = getActiveEntity(this.state.institution.names);
    return (
      <Card id={`card-${this.props.id}`}>
        <CardHeader className="btn text-left" onClick={this.redirectToInstitution}>
          <h4 className="text-primary">{name.initials}
            {name.initials === name.text ? '' : ` - ${name.text.toProperCase()}`}
          </h4>
        </CardHeader>
        {this.renderResources()}
      </Card>);
  }
}

InstitutionConflictContainer.propTypes = {
  addresses: PropTypes.array.isRequired,
  codes: PropTypes.array.isRequired,
  date_end: PropTypes.array.isRequired,
  date_start: PropTypes.array.isRequired,
  daughters: PropTypes.array.isRequired,
  followers: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired,
  links: PropTypes.array.isRequired,
  mothers: PropTypes.array.isRequired,
  names: PropTypes.array.isRequired,
  predecessors: PropTypes.array.isRequired,
  synonym: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
};


export default InstitutionConflictContainer;
