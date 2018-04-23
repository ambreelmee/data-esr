import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button, Col, FormGroup, Input,
  InputGroup, InputGroupAddon, Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import getActiveEntity from './methods'

class EvolutionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: '',
      dropdown: false,
      errorMessage: '',
      evolutionId: null,
      evolutionType: '',
      evolutionCategoryId: '',
      institutions: [],
      isLoading: false,
      isSearching: false,
      modal: true,
      searchEntry: '',
    };
    this.addInstitutionEvolution = this.addInstitutionEvolution.bind(this);
    this.getData = debounce(this.getData, 1000);
    this.onChange = this.onChange.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onSelectorChange = this.onSelectorChange.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  componentWillMount() {
    this.getEvolutionCategories();
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  onSearchChange(event) {
    event.preventDefault();
    this.setState({ [event.target.id]: event.target.value });
    this.getData();
  }

  onKeyPress(event) {
    if (event.key === 'Enter') {
      this.addInstitutionEvolution();
    }
  }

  onSelectorChange(event) {
    this.setState({
      [event.target.id]: document.getElementById(`${event.target.id}`).value,
    });
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

  getData() {
    this.setState({ isSearching: true });
    const params = encodeURI(this.state.searchEntry);
    fetch(`${process.env.API_URL_STAGING}institutions/search?q=${params}`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          institutions: data,
          isSearching: false,
        });
      });
  }

  resetSearch() {
    this.setState({ searchEntry: '' });
    this.getData();
  }

  toggle() {
    this.props.toggleModal();
    this.setState({
      modal: !this.state.modal,
      errorMessage: '',
    });
  }

  toggleDropdown() {
    this.setState({ dropdown: !this.state.dropdown });
  }

  addInstitutionEvolution() {
    this.setState({ isLoading: true });
    const newEvolution = {};
    newEvolution[this.state.evolutionType] = {
      [`${this.state.evolutionType}_id`]: this.state.evolutionId,
      institution_evolution_category_id: this.state.evolutionCategoryId,
      date: this.state.date,
    };
    fetch(
      `${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}/${this.state.evolutionType}s`,
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
            this.toggle();
            this.props.getInstitutionEvolution(this.props.etablissement_id);
          });
        } else {
          this.setState({
            errorMessage: 'Erreur, merci de vérifier le formulaire',
            isLoading: false,
          });
        }
      });
  }

  renderEvolutionCategories() {
    if (this.state.isLoading) {
      return '';
    }
    return this.state.evolutionCategories.map(category =>
      <option key={category.id} value={category.id}>{category.title}</option>);
  }

  renderInstitutionNameSuggestions() {
    if (this.state.isSearching) {
      return <option>Chargement...</option>;
    }
    if (this.state.institutions.length === 0) {
      return <option>Aucun résultat</option>;
    }
    return this.state.institutions.map(institution => (
      <option key={institution.id} value={institution.id}>
        {institution.names.find(name => name.status === 'active') ?
        institution.names.find(name => name.status === 'active').text : ''}
      </option>));
  }


  render() {
    if (this.state.evolutionCategoryId === 'redirect') {
      return <Redirect to="/categories" />;
    }
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          Ajouter une évolution
        </ModalHeader>
        <ModalBody>
          <FormGroup row>
            <Col xs="6">
              <select
                id="evolutionType"
                className="form-control form-control-warning"
                onChange={this.onSelectorChange}
              >
                <option value="0">Sens de l&#39;évolution</option>
                <option value="predecessor" >Prédecesseur</option>
                <option value="follower">Successeur</option>
              </select>
            </Col>
            <Col xs="6">
              <select
                id="evolutionCategoryId"
                className="form-control"
                onChange={this.onSelectorChange}
              >
                <option value="0">Type d&#39;évolution</option>
                {this.renderEvolutionCategories()}
                <option value="redirect">Gérer les évolutions...</option>
              </select>
            </Col>
            <Col xs="12" className="mx-auto mt-3">
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <Button
                    type="button"
                    color="primary"
                    onClick={this.onSearchChange}
                    className="col-xs-1"
                  >
                    {this.state.isSearching ?
                      <i className="fa fa-spinner fa-spin" /> :
                      <i className="fa fa-search" />}
                  </Button>
                </InputGroupAddon>
                <Input
                  id="searchEntry"
                  className="col-xs-11"
                  type="text"
                  placeholder="1. Rechercher un établissement"
                  value={this.state.searchEntry}
                  onChange={this.onSearchChange}
                  onFocus={(e) => {
                    const val = e.target.value;
                    e.target.value = '';
                    e.target.value = val;
                  }}
                />
                <select
                  id="evolutionId"
                  className="form-control"
                  onChange={this.onSelectorChange}
                >
                  <option>2. Choisir...</option>
                  {this.renderInstitutionNameSuggestions()}
                </select>
              </InputGroup>
            </Col>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <p className="mt-2 text-danger">{this.state.errorMessage}</p>
          <Button
            className="m-1 float-right"
            color="primary"
            disabled={this.state.isLoading}
            onClick={!this.state.isLoading ? this.addInstitutionEvolution : null}
          >
            {this.state.isLoading ?
              <div>
                <i className="fa fa-spinner fa-spin " />
                <span className="mx-1"> Ajout </span>
              </div> : <div>Ajouter une évolution</div>}
          </Button>
          <Button color="secondary" onClick={this.toggle}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

EvolutionModal.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
  getInstitutionEvolution: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};


export default EvolutionModal;
