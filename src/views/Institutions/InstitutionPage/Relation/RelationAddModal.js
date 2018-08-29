import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button, Col, FormGroup, Input,
  InputGroup, InputGroupAddon, Label, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';


class RelationAddModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: '',
      dropdown: false,
      errorMessage: '',
      relationInstitutionId: '',
      relationType: '',
      categoryId: '',
      closure: false,
      institutions: [],
      isLoading: false,
      isSearching: false,
      modal: true,
      searchEntry: '',
    };
    this.getData = debounce(this.getData, 1000);
    this.onChange = this.onChange.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onSelectorChange = this.onSelectorChange.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleClosure = this.toggleClosure.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
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
      if (this.state.closure) {
        this.updateInstitution();
      }
      this.addRelation();
    }
  }

  onClick() {
    if (this.state.closure) {
      this.updateInstitution();
    }
    this.addRelation();
  }

  onSelectorChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
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

  updateInstitution() {
    const updatedInstitution = {
      date_end: this.state.date,
    };
    const targetId = this.state.relationType === 'predecessors' ?
      this.state.relationInstitutionId : this.props.institutionId;
    fetch(`${process.env.API_URL_STAGING}institutions/${targetId}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({ institution: updatedInstitution }),
    })
      .then(res => res.json())
      .then((data) => {
        if (data === 'Record not found') {
          this.setState({
            errorMessage: 'Formulaire est vide ou incomplet',
          });
        } else {
          this.props.getRelations(this.props.institutionId, this.state.relationType);
        }
      });
  }

  addRelation() {
    this.setState({ isLoading: true });
    const newEvolution = {};
    newEvolution[`${this.state.relationType.slice(0, -1)}`] = {
      [`${this.state.relationType.slice(0, -1)}_id`]: this.state.relationInstitutionId,
      [`institution_${this.props.type}_category_id`]: this.state.categoryId,
      date: this.state.date,
    };
    fetch(
      `${process.env.API_URL_STAGING}institutions/${this.props.institutionId}/${this.state.relationType}`,
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
              modal: false,
            });
            this.props.getRelations(this.props.institutionId, this.state.relationType);
          });
        } else {
          this.setState({
            errorMessage: 'Erreur, merci de vérifier le formulaire',
            isLoading: false,
          });
        }
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

  toggleClosure() {
    this.setState({
      closure: !this.state.closure,
    });
  }

  toggleDropdown() {
    this.setState({ dropdown: !this.state.dropdown });
  }

  renderCategories() {
    if (this.state.isLoading) {
      return '';
    }
    return this.props.categories.map(category =>
      <option key={`${this.props.type}-${category.id}`} value={category.id}>{category.title}</option>);
  }

  renderInstitutionNameSuggestions() {
    if (this.state.isSearching) {
      return <option>Chargement...</option>;
    }
    if (this.state.institutions.length === 0) {
      return <option>Aucun résultat</option>;
    }
    return this.state.institutions.map(institution => (
      <option key={`institution-${institution.id}`} value={institution.id}>
        {institution.names[0].text}
      </option>));
  }


  render() {
    if (this.state.categoryId === 'redirect') {
      return <Redirect to={this.props.type === 'evolution' ? '/evolutions' : '/rattachements'} />;
    }
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          Ajouter un{this.props.type === 'evolution' ? 'e évolution ' : ' rattachement'}
        </ModalHeader>
        <ModalBody>
          <FormGroup row>
            <Col xs="6">
              {this.props.type === 'evolution' ?
                <select
                  id="relationType"
                  value={this.state.relationType}
                  className="form-control form-control-warning"
                  onChange={this.onSelectorChange}
                >
                  <option value="0">Sens de l&#39;évolution</option>
                  <option value="predecessors" >Prédecesseur</option>
                  <option value="followers">Successeur</option>
                </select> :
                <select
                  id="relationType"
                  value={this.state.relationType}
                  className="form-control form-control-warning"
                  onChange={this.onSelectorChange}
                >
                  <option value="0">Sens du rattachement</option>
                  <option value="mothers" >Mère</option>
                  <option value="daughters">Fille</option>
                </select>}
            </Col>
            <Col xs="6">
              <select
                id="categoryId"
                className="form-control"
                onChange={this.onSelectorChange}
                value={this.state.categoryId}
              >
                <option value="0">Catégorie</option>
                {this.renderCategories()}
                <option value="redirect">
                  Gérer les {this.props.type === 'evolution' ? 'évolution...' : 'rattachements...'}
                </option>
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
                  id="relationInstitutionId"
                  className="form-control"
                  onChange={this.onSelectorChange}
                  value={this.state.relationInstitutionId}
                >
                  <option>2. Choisir...</option>
                  {this.renderInstitutionNameSuggestions()}
                </select>
              </InputGroup>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col xs="4" />
            <Col xs="2" className="mx-auto">
              <Label>Date</Label>
            </Col>
            <Col xs="6" className="mx-auto">
              <Input
                type="date"
                id="date"
                value={this.state.date}
                onChange={this.onChange}
              />
            </Col>
          </FormGroup>
          {this.props.type === 'evolution' ?
            <FormGroup check className="checkbox">
              <Input
                className="form-check-input"
                type="checkbox"
                id="checkbox1"
                value="closure"
                onChange={this.toggleClosure}
              />
              <Label check className="form-check-label" htmlFor="checkbox1">
                Déclarer l&#39;établissement prédécesseur comme fermé (préciser la date)
              </Label>
            </FormGroup> : <div />}
        </ModalBody>
        <ModalFooter>
          <p className="mt-2 text-danger">{this.state.errorMessage}</p>
          <Button
            className="m-1 float-right"
            color="primary"
            disabled={this.state.isLoading}
            onClick={!this.state.isLoading ? this.onClick : null}
          >
            {this.state.isLoading ?
              <div>
                <i className="fa fa-spinner fa-spin " />
                <span className="mx-1"> Ajout </span>
              </div> :
              <div>Ajouter un{this.props.type === 'evolution' ? 'e évolution' : ' rattachement'}</div>}
          </Button>
          <Button color="secondary" onClick={this.toggle}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

RelationAddModal.propTypes = {
  categories: PropTypes.array.isRequired,
  institutionId: PropTypes.number.isRequired,
  getRelations: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};


export default RelationAddModal;
