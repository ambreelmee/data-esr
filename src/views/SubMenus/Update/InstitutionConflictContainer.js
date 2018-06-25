import React, { Component } from 'react';
import { Alert, Card, CardHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import map from 'lodash/map';

import { getActiveEntity, getActiveEntities } from '../../Etablissements/methods';
import ResourceConflictContainer from './ResourceConflictContainer';

class InstitutionConflictContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      institution: {},
      isLoading: false,
    };
  }

  componentWillMount() {
    this.getInstitution();
  }

  getInstitution() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${this.props.conflict.id}`, {
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

  renderResources() {
    return map(this.state.institution, (resource, key) => {
      const conflict = this.props.conflict[key]
      if (conflict && conflict.length > 0) {
        const current = conflict[0].category ?
          resource.find(item => item.status === 'active' && item.category === conflict[0].category) :
          getActiveEntity(resource)
        return (
          <ResourceConflictContainer
            key={current.id}
            id={current.id}
            current={current}
            conflict={conflict}
            resource={key}
          />);
      }
    });
  }


  render() {
    if (this.state.isLoading) {
      return <p />;
    }
    if (this.state.error) {
      return <Alert color="danger">Impossible de charger les données. Veuillez réessayer ultérieurement </Alert>;
    }
    const name = getActiveEntity(this.state.institution.names);
    return (
      <Card>
        <CardHeader>
          <h4 className="text-primary">{name.initials}
            {name.initials === name.text ? '' : ` - ${name.text.toProperCase()}`}
          </h4>
        </CardHeader>
        {this.renderResources()}
      </Card>);
  }
}

InstitutionConflictContainer.propTypes = {
  conflict: PropTypes.object.isRequired,
};


export default InstitutionConflictContainer;
