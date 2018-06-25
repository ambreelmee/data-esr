import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import PropTypes from 'prop-types';

import InstitutionConflictContainer from './InstitutionConflictContainer';

const fakeData = [
  {
    id: 219,
    addresses: [
      {
        current_value: '12 rue des bois',
        new_value: '20 avenue jean jaures',
        field_name: 'address_1',
        source: 'bce',
        date: '2018-04-05',
        category: null,
      },
      {
        current_value: '75012',
        new_value: '75020',
        field_name: 'zip_code',
        source: 'bce',
        date: '2018-05-05',
        category: null,
      }],
    codes: [
      {
        current_value: '48643518',
        new_value: '4894321',
        field_name: 'content',
        source: 'bce',
        date: '2018-06-05',
        category: 'uai',
      },
    ],
  },
  {
    id: 220,
    addresses: [
      {
        current_value: '12 rue des bois',
        new_value: '20 avenue jean jaures',
        field_name: 'address_1',
        source: 'bce',
        date: '2018-04-05',
        category: null,
      },
      {
        current_value: '75012',
        new_value: '75020',
        field_name: 'zip_code',
        source: 'bce',
        date: '2018-05-05',
        category: null,
      }],
    codes: [],
  },
];

class Update extends Component {
  constructor(props) {
    super(props);

    this.state = {
      institutions: [],
      isLoading: false,
    };
  }

  componentWillMount() {
    this.getAllConflicts();
  }

  getAllConflicts() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_BCE_URL}conflicts/18`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            this.setState({
              institutions: fakeData,
              isLoading: false,
              data,
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

  renderInstitutionConflicts() {
    return this.state.institutions.map(institution => (
      <InstitutionConflictContainer
        key={institution.id}
        conflict={institution}
      />))
  }

  render() {
    if (this.state.isLoading) {
      return <p />;
    }
    if (this.state.error) {
      return <Alert color="danger">Impossible de charger les données. Veuillez réessayer ultérieurement </Alert>;
    }
    return (
      <div className="animated fadeIn p-5">
        <h2 className="text-center">
          Gestion des <span className="text-primary"><strong>mises à jour </strong></span>
          des établissements
        </h2>
        {this.state.institutions.length === 0 ?
          <Alert className="m-5" color="success">Aucune mise à jour pour le moment !</Alert> :
          <div className="mt-5">{this.renderInstitutionConflicts()}</div>}
      </div>);
  }
}

Update.propTypes = {
  categoryType: PropTypes.string,
};

Update.defaultProps = {
  categoryType: null,
};

export default Update;
