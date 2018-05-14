import React, { Component } from 'react';
import {
  Button, ButtonDropdown, ButtonGroup, Card, CardBody, CardHeader, DropdownItem, DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';

import AddModal from './../AddModal';
import EvolutionsModal from './EvolutionsModal';

const options = {
  responsive: true,
  legend: { display: false },
  scales: {
    xAxes: [{
      display: false,
    }],
    yAxes: [{
      type: 'category',
      position: 'left',
      display: false,
    }],
  },
  layout: {
    padding: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10,
    },
  },
  tooltips: { displayColors: false },
};

class Evolution extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addModal: false,
      index: null,
      displaySettingDropdown: false,
      evolutionCategories: [],
      evolutionsModal: false,
      followers: [],
      isFollowersLoading: false,
      isPredecessorsLoading: false,
      institutionName: null,
      predecessors: [],
      redirectToInstitution: false,
    };
    this.addInstitutionEvolution = this.addInstitutionEvolution.bind(this);
    this.displaySettingDropdown = this.displaySettingDropdown.bind(this);
    this.getInstitutionEvolution = this.getInstitutionEvolution.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleEvolutionsModal = this.toggleEvolutionsModal.bind(this);
  }

  componentWillMount() {
    this.getEvolutionCategories();
    this.getInstitutionEvolution(this.props.etablissement_id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ redirectToInstitution: false });
    this.getInstitutionEvolution(nextProps.etablissement_id);
  }

  getEvolutionCategories() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institution_evolution_categories`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          evolutionCategories: data,
          isLoading: false,
        });
      });
  }


  getInstitutionEvolution(etablissementId) {
    const customDatesets = [];
    const customYLabels = ['Université actuelle'];
    const datasetInitialObject = {
      label: '',
      fill: true,
      borderColor: 'rgba(179,181,198,1)',
      pointBorderColor: 'rgba(179,181,198,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: 'rgba(179,181,198,1)',
      pointHoverBorderColor: 'rgba(179,181,198,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 5,
      data: ['', 'Université actuelle'],
    };
    customDatesets.push(datasetInitialObject);
    this.setState({ isPredecessorsLoading: true, isFollowersLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${etablissementId}/predecessors`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((results) => {
        if (results.evolutions.length > 0) {
          let count = 0;
          results.evolutions.map((evolution) => {
            const datasetObject = {
              label: '',
              fill: false,
              borderColor: 'rgba(75,192,192,1)',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 8,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 5,
              data: ['Université actuelle'],
            };
            datasetObject.data.unshift(`${evolution.predecessor.name}`);
            datasetObject.label = `${evolution.evolution.category}`;
            if (count % 2 === 0) {
              customYLabels.push(`${evolution.predecessor.name}`);
            } else {
              customYLabels.unshift(`${evolution.predecessor.name}`);
            }
            customDatesets.push(datasetObject);
            count += 1;
            return customDatesets;
          });
          customYLabels.push();
        }
        this.setState({
          predecessors: results.evolutions,
          isPredecessorsLoading: false,
        });
      });
    fetch(`${process.env.API_URL_STAGING}institutions/${etablissementId}/followers`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((results) => {
        if (results.evolutions.length > 0) {
          let count = 0;
          results.evolutions.map((evolution) => {
            const datasetObject = {
              label: '',
              fill: false,
              borderColor: 'rgba(255,99,132,1)',
              pointBorderColor: 'rgba(255,99,132,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 8,
              pointHoverBackgroundColor: 'rgba(255,99,132,1)',
              pointHoverBorderColor: 'rgba(255,99,132,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 5,
              data: ['Université actuelle'],
            };
            datasetObject.data.unshift('');
            datasetObject.data.push(`${evolution.follower.name}`);
            datasetObject.label = `${evolution.evolution.category}`;
            if (count % 2 === 0) {
              customYLabels.push(`${evolution.follower.name}`);
            } else {
              customYLabels.unshift(`${evolution.follower.name}`);
            }
            customDatesets.push(datasetObject);
            count += 1;
            return customDatesets;
          });
        }
        this.setState({
          followers: results.evolutions,
          isFollowersLoading: false,
          customDatesets,
          customYLabels,
        });
      });
  }


  addInstitutionEvolution(etablissementId, evolutionCategoryId, date, evolutionType) {
    this.setState({ isLoading: true });
    const newEvolution = {};
    newEvolution[`${evolutionType.slice(0, -1)}`] = {
      [`${evolutionType.slice(0, -1)}_id`]: etablissementId,
      institution_evolution_category_id: evolutionCategoryId,
      date,
    };
    fetch(
      `${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}/${evolutionType}`,
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
        body: JSON.stringify(newEvolution),
      },
    )
      .then((res) => {
        if (res.ok) {
          res.json().then(() => {
            this.setState({
              errorMessage: '',
              isLoading: false,
            });
            this.getInstitutionEvolution(this.props.etablissement_id);
          });
        } else {
          this.setState({
            errorMessage: 'Erreur, merci de vérifier le formulaire',
            isLoading: false,
          });
        }
      });
  }


  toggleEvolutionsModal() {
    this.setState({
      evolutionsModal: !this.state.evolutionsModal,
    });
  }

  toggleAddModal() {
    this.setState({
      addModal: !this.state.addModal,
    });
  }

  displaySettingDropdown() {
    this.setState({
      displaySettingDropdown: !this.state.displaySettingDropdown,
    });
  }

  render() {
    if (this.state.isFollowersLoading || this.state.isPredecessorsLoading) {
      return <p />;
    }
    if (this.state.redirectToInstitution) {
      const evolutionType = this.state.index === 0 ? 'predecessor' : 'follower';
      const institutionId = this.state[`${evolutionType}s`].find(evolution =>
        evolution[evolutionType].name === this.state.institutionName)[evolutionType].id;
      return <Redirect to={`/etablissements/${institutionId}`} />;
    }
    return (
      <Card className="mt-2 mb-0">
        <CardHeader>
          Evolutions
          <ButtonGroup className="float-right">
            <ButtonDropdown
              id="codeDropdown"
              isOpen={this.state.displaySettingDropdown}
              toggle={this.displaySettingDropdown}
            >
              <DropdownToggle caret className="p-0" color="light">
                <i className="icon-settings" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={this.toggleAddModal}>
                  <i className="fa fa-plus text-success" />
                    Ajouter une évolution
                </DropdownItem>
                {this.state.addModal ?
                  <AddModal
                    etablissement_id={this.props.etablissement_id}
                    getData={this.props.getData}
                    categories={this.state.evolutionCategories}
                    addMethod={this.addInstitutionEvolution}
                    toggleModal={this.toggleAddModal}
                    type="évolution"
                  /> : <div />}
                <DropdownItem onClick={this.toggleEvolutionsModal}>
                  <i className="fa fa-eye text-info" />
                    Gérer les évolutions
                </DropdownItem>
                {this.state.evolutionsModal ?
                  <EvolutionsModal
                    id={this.props.etablissement_id}
                    followers={this.state.followers}
                    getInstitutionEvolution={this.getInstitutionEvolution}
                    predecessors={this.state.predecessors}
                    toggleModal={this.toggleEvolutionsModal}
                  /> : <div />}
              </DropdownMenu>
            </ButtonDropdown>
          </ButtonGroup>
        </CardHeader>
        <CardBody>
          <div className="chart-wrapper">
            {this.state.followers.length === 0 && this.state.predecessors.length === 0 ?
              <div>
                <em>Aucune évolution enregistrée actuellement...</em>
                <Button color="primary" className="float-right" onClick={this.toggleAddModal}>
                  <i className="fa fa-plus mr-1" />
                  Ajouter une évolution
                </Button>
                {this.state.addModal ?
                  <AddModal
                    etablissement_id={this.props.etablissement_id}
                    getData={this.props.getData}
                    categories={this.state.evolutionCategories}
                    addMethod={this.addInstitutionEvolution}
                    toggleModal={this.toggleAddModal}
                    type="évolution"
                  /> : <div />}
              </div> :
              <div>
                <Line
                  data={{
                    xLabels: ['Prédecesseurs', 'Actuel', 'Successeurs'],
                    yLabels: this.state.customYLabels,
                    title: 'Evolutions',
                    datasets: this.state.customDatesets,
                  }}
                  options={options}
                  getElementAtEvent={(elems) => {
                    const datasetIndex = elems[0]._datasetIndex;
                    const index = elems[0]._index;
                    const name = elems[0]._chart.config.data.datasets[datasetIndex].data[index];
                    if (name !== 'Université actuelle') {
                      this.setState({ redirectToInstitution: true, institutionName: name, index });
                    }
                  }}
                />
              Cliquer sur un point pour être redirigé vers l&#39;établissement
              </div>}
          </div>
        </CardBody>
      </Card>
    );
  }
}

Evolution.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
  getData: PropTypes.func.isRequired,
};

export default Evolution;
