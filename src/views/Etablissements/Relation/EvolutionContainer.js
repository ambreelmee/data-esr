import React, { Component } from 'react';
import {
  Button, ButtonGroup, ButtonDropdown, Card, CardBody, CardHeader, Col, DropdownItem,
  DropdownMenu, DropdownToggle, Row,
} from 'reactstrap';
import PropTypes from 'prop-types';
import map from 'lodash/map';

import RelationAddModal from './RelationAddModal';
import RelationCategoryContainer from './RelationCategoryContainer';
import EvolutionsModal from './EvolutionsModal';

class EvolutionContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addModal: false,
      evolutionCategories: [],
      evolutionsModal: false,
      followers: [],
      displayDropdown: false,
      isLoading: false,
      predecessors: [],
    };
    this.displayDropdown = this.displayDropdown.bind(this);
    this.getEvolutions = this.getEvolutions.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleEvolutionsModal = this.toggleEvolutionsModal.bind(this);
  }

  componentWillMount() {
    this.getEvolutionCategories();
    this.getEvolutions(this.props.etablissement_id, 'predecessors');
    this.getEvolutions(this.props.etablissement_id, 'followers');
  }

  componentWillReceiveProps(nextProps) {
    this.getEvolutions(nextProps.etablissement_id, 'predecessors');
    this.getEvolutions(nextProps.etablissement_id, 'followers');
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
          addModal: false,
          evolutionsModal: false,
        });
      });
  }

  getEvolutions(etablissementId, evolutionType) {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${etablissementId}/${evolutionType}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          [evolutionType]: data.evolutions,
          isLoading: false,
        });
      });
  }

  getEvolutionsByCategory() {
    const evolutionsByCategory = {};
    this.state.predecessors.map((predecessor) => {
      if (!evolutionsByCategory[predecessor.evolution.category]) {
        evolutionsByCategory[predecessor.evolution.category] = { predecessors: [], followers: [] };
      }
      evolutionsByCategory[predecessor.evolution.category].predecessors.push(predecessor.predecessor);
    });
    this.state.followers.map((follower) => {
      if (!evolutionsByCategory[follower.evolution.category]) {
        evolutionsByCategory[follower.evolution.category] = { predecessors: [], followers: [] };
      }
      evolutionsByCategory[follower.evolution.category].followers.push(follower.follower);
    });
    return evolutionsByCategory;
  }


  displayDropdown() {
    this.setState({
      displayDropdown: !this.state.displayDropdown,
    });
  }

  toggleAddModal() {
    this.setState({
      addModal: !this.state.addModal,
    });
  }

  toggleEvolutionsModal() {
    this.setState({
      evolutionsModal: !this.state.evolutionsModal,
    });
  }

  renderCategories() {
    const evolutionsByCategory = this.getEvolutionsByCategory();
    return map(evolutionsByCategory, (connection, category) => (
      <RelationCategoryContainer
        key={category}
        category={category}
        relationDown={connection.followers}
        relationUp={connection.predecessors}
      />
    ));
  }

  render() {
    if (this.state.isLoading) {
      return <p />;
    }
    return (
      <Card className="mb-0 mt-2 w-100">
        <CardHeader>
          Evolutions
          <ButtonGroup className="float-right">
            <ButtonDropdown
              id="nameDropdown"
              isOpen={this.state.displayDropdown}
              toggle={this.displayDropdown}
            >
              <DropdownToggle caret className="p-0" color="light">
                <i className="icon-settings" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={this.toggleAddModal}>
                  <i className="fa fa-plus text-success" />
                    Ajouter un nouveau rattachement
                </DropdownItem>
                {this.state.addModal ?
                  <RelationAddModal
                    institutionId={this.props.etablissement_id}
                    categories={this.state.evolutionCategories}
                    getRelations={this.getEvolutions}
                    getData={this.props.getData}
                    toggleModal={this.toggleAddModal}
                    type="rattachement"
                  /> : <div />}
                <DropdownItem onClick={this.toggleEvolutionsModal}>
                  <i className="fa fa-eye text-info" />
                    Voir le détail des rattachements
                </DropdownItem>
                {this.state.evolutionsModal ?
                  <EvolutionsModal
                    followers={this.state.followers}
                    id={this.props.etablissement_id}
                    getEvolutions={this.getEvolutions}
                    predecessors={this.state.predecessors}
                    toggleModal={this.toggleEvolutionsModal}
                  /> : <div />}
              </DropdownMenu>
            </ButtonDropdown>
          </ButtonGroup>
        </CardHeader>
        {this.state.predecessors.length > 0 || this.state.followers.length > 0 ?
          <CardBody className="py-0">
            <Row>
              <Col xs="3" className="mx-auto" />
              <Col xs="4" className="mx-auto">
                <strong>Prédécesseur</strong>
              </Col>
              <Col xs="4" className="mx-auto">
                <strong>Successeur</strong>
              </Col>
            </Row>
            {this.renderCategories()}
          </CardBody> :
          <CardBody>
            <em>Aucune évolution enregistré actuellement...</em>
            <Button color="primary" className="float-right" onClick={this.toggleAddModal}>
              <i className="fa fa-plus mr-1" />
              Ajouter un rattachement
            </Button>
          </CardBody>}
      </Card>
    );
  }
}

EvolutionContainer.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
  getData: PropTypes.func.isRequired,
};

export default EvolutionContainer;
