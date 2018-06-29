import React, { Component } from 'react';
import { Alert, Button } from 'reactstrap';

import InstitutionConflictContainer from './InstitutionConflictContainer';

const fakeData = [
  {
    id: 219,
    addresses: [
      {
        current_value: '193  AVENUE PAUL MULLER',
        new_value: '20 avenue jean jaures',
        field_name: 'address_1',
        source: 'bce',
        date: '2018-04-05',
        category: null,
      },
      {
        current_value: '54602',
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
      {
        current_value: '48643518',
        new_value: '4894322',
        field_name: 'content',
        source: 'bce',
        date: '2018-06-05',
        category: 'uai',
      },
    ],
    date_end: [
      {
        current_value: null,
        new_value: '2018-06-05',
        field_name: 'date_end',
        source: 'bce',
        date: '2018-04-05',
        category: null,
      },
    ],
    date_start: [],
    daughters: [],
    followers: [],
    links: [],
    mothers: [],
    names: [],
    predecessors: [],
    synonym: [],
    tags: [],
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
    date_end: [],
    date_start: [],
    daughters: [],
    followers: [],
    links: [],
    mothers: [],
    names: [],
    predecessors: [],
    synonym: [],
    tags: [],
  },
];

class UpdateContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      institutions: fakeData,
      isLoading: false,
      visible: true,
    };
    this.onDismiss = this.onDismiss.bind(this);
  }
  componentWillMount() {
    // this.getAllConflicts();
  }

  onDismiss() {
    this.setState({ visible: false });
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
            institutions: fakeData,
            isLoading: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          institutions: fakeData,
          isLoading: false,
        });
      });
  }

  renderInstitutionConflicts() {
    return this.state.institutions.map(institution => (
      <InstitutionConflictContainer
        key={institution.id}
        addresses={institution.addresses}
        codes={institution.codes}
        date_end={institution.date_end}
        date_start={institution.date_start}
        daughters={institution.daughters}
        followers={institution.followers}
        id={institution.id}
        links={institution.links}
        mothers={institution.mothers}
        names={institution.names}
        predecessors={institution.predecessors}
        synonym={institution.synonym}
        tags={institution.tags}
      />));
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
        <h2 className="text-center mb-5">
          Gestion des <span className="text-primary"><strong>mises à jour </strong></span>
          des établissements
        </h2>
        <Alert color="info" className="mb-3" isOpen={this.state.visible} toggle={this.onDismiss}>
          <div className="alert-heading"><strong>Il y a 32 mises à jour en attente !</strong></div>
          En <strong><span className="text-danger">rouge</span></strong> apparaissent les valeurs
          actuellement enregistrées dans la base et en <strong><span className="text-success">vert</span></strong> les
          nouvelles valeurs détectées. Le reste des champs est masqué par défaut.
          Pour les faire apparaître cliquer sur le
          bouton <Button className="rounded" size="sm" outline color="secondary">
            <i className="fa fa-chevron-down" /></Button> à gauche de chaque bloc.<br />

          Vous pouvez modifier ces valeurs avant de valider la mise à jour, soit sous
          forme d&#39;une nouvelle entrée qui archivera l&#39;entrée actuelle mais conservera les informations telles
          quelles, soit en modifiant directement l&#39;entrée actuelle. <br />
          Vous pouvez également rejeter une mise à jour, celle-ci n&#39;apparaîtra alors plus dans votre fil.
        </Alert>
        {this.state.institutions.length === 0 ?
          <Alert className="m-5" color="success">Aucune mise à jour pour le moment !</Alert> :
          <div>{this.renderInstitutionConflicts()}</div>}
      </div>);
  }
}

export default UpdateContainer;
