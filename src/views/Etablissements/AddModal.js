import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button, Col, FormGroup, Input,
  InputGroup, InputGroupAddon, Label, Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';


class AddModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: '',
      dropdown: false,
      errorMessage: '',
      etablissementId: null,
      categoryType: '',
      categoryId: '',
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
    this.onSelectorChange = this.onSelectorChange.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.toggle = this.toggle.bind(this);
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
      this.props.addMethod(
        this.state.etablissementId,
        this.state.categoryId,
        this.state.date,
        this.state.categoryType
      );
    }
  }

  onSelectorChange(event) {
    this.setState({
      [event.target.id]: document.getElementById(`${event.target.id}`).value,
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

  renderCategories() {
    if (this.state.isLoading) {
      return '';
    }
    return this.props.categories.map(category =>
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
    if (this.state.categoryId === 'redirect') {
      return <Redirect to="/categories" />;
    }
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          Ajouter un{this.props.type === 'évolution' ? 'e ' : ' '}{this.props.type}
        </ModalHeader>
        <ModalBody>
          <FormGroup row>
            <Col xs="6">
            {this.props.type === 'évolution' ?
              <select
                id="categoryType"
                className="form-control form-control-warning"
                onChange={this.onSelectorChange}
              >
                <option value="0">Sens de l&#39;évolution</option>
                <option value="predecessor" >Prédecesseur</option>
                <option value="follower">Successeur</option>
              </select> :
              <select
                id="categoryType"
                className="form-control form-control-warning"
                onChange={this.onSelectorChange}
              >
                <option value="0">Sens du rattachement</option>
                <option value="mother" >Mère</option>
                <option value="daughter">Fille</option>
              </select>}

            </Col>
            <Col xs="6">
              <select
                id="categoryId"
                className="form-control"
                onChange={this.onSelectorChange}
              >
                <option value="0">Catégorie</option>
                {this.renderCategories()}
                <option value="redirect">Gérer les {this.props.type}...</option>
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
                  id="etablissementId"
                  className="form-control"
                  onChange={this.onSelectorChange}
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
        </ModalBody>
        <ModalFooter>
          <p className="mt-2 text-danger">{this.state.errorMessage}</p>
          <Button
            className="m-1 float-right"
            color="primary"
            disabled={this.state.isLoading}
            onClick={!this.state.isLoading ?
              () => this.props.addMethod(
                this.state.etablissementId,
                this.state.categoryId,
                this.state.date,
                this.state.categoryType,
                this.props.type === 'évolution' ? 'evolution' : 'connection'
              ) :
              null}
          >
            {this.state.isLoading ?
              <div>
                <i className="fa fa-spinner fa-spin " />
                <span className="mx-1"> Ajout </span>
              </div> : <div>Ajouter un{this.props.type === 'évolution' ? 'e ':' '}{this.props.type}</div>}
          </Button>
          <Button color="secondary" onClick={this.toggle}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

AddModal.propTypes = {
  addMethod: PropTypes.func.isRequired,
  etablissement_id: PropTypes.number.isRequired,
  categories: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};


export default AddModal;
