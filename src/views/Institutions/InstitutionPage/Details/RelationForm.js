import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button, Col, Form, FormGroup, Input,
  InputGroup, InputGroupAddon, Label, Card, CardBody, CardFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import UpdateFormButton from './UpdateFormButton';


class RelationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: '',
      dropdown: false,
      relationInstitutionId: '',
      categoryId: '',
      closure: false,
      searchEntry: '',
    };
    this.search = debounce(this.props.search, 1000);
    this.onChange = this.onChange.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onSelectorChange = this.onSelectorChange.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.toggleClosure = this.toggleClosure.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  onSearchChange(event) {
    event.preventDefault();
    this.setState({ [event.target.id]: event.target.value });
    const searchValue = event.target.value;
    this.search(searchValue);
  }

  onKeyPress(event) {
    if (event.key === 'Enter') {
      this.onClick();
    }
  }

  onClick() {
    if (this.state.closure) {
      const institution = {
        date_end: this.state.date,
      };
      const targetId = this.props.relationType === 'predecessors' ?
        this.state.relationInstitutionId : this.props.institutionId;
      const statusUrl = `${process.env.API_URL_STAGING}institutions/${targetId}`;
      this.props.addContent(statusUrl, JSON.stringify({ institution }), 'PUT', this.props.institutionId);
    }
    if (this.props.id) {
      const editUrl = `${process.env.API_URL_STAGING}institutions/${this.props.institutionId}/${this.props.relationType}/${this.props.relationInstitutionId}`;
      const editEvolution = {};
      editEvolution[`${this.props.relationType.slice(0, -1)}`] = {
        [`${this.props.relationType.slice(0, -1)}_id`]: this.props.relationInstitutionId,
        [`institution_${this.props.type}_category_id`]: this.props.categoryId,
        date: this.state.date,
      };
      this.props.addContent(editUrl, JSON.stringify(editEvolution), 'PUT', this.props.institutionId);
    } else {
      const url = `${process.env.API_URL_STAGING}institutions/${this.props.institutionId}/${this.props.relationType}`;
      const newEvolution = {};
      newEvolution[`${this.props.relationType.slice(0, -1)}`] = {
        [`${this.props.relationType.slice(0, -1)}_id`]: this.state.relationInstitutionId,
        [`institution_${this.props.type}_category_id`]: this.state.categoryId,
        date: this.state.date,
      };
      this.props.addContent(url, JSON.stringify(newEvolution), 'POST', this.props.institutionId);
    }
  }

  onSelectorChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  resetSearch() {
    this.setState({ searchEntry: '' });
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
    return this.props.categories.map(category => (
      <option
        key={`${this.props.type}-${category.id}`}
        value={category.id}
      >
        {category.title}
      </option>));
  }

  renderInstitutionNameSuggestions() {
    if (this.props.searchIsLoading) {
      return <option>Chargement...</option>;
    }
    if (this.props.institutions.length === 0) {
      return <option>Aucun résultat</option>;
    }
    return this.props.institutions.map(institution => (
      <option key={`institution-${institution.id}`} value={institution.id}>
        {institution.names[0].text}
      </option>));
  }


  render() {
    const deleteUrl = `${process.env.API_URL_STAGING}institutions/${this.props.institutionId}/${this.props.relationType}/${this.props.relationInstitutionId}`;
    if (this.state.categoryId === 'redirect') {
      return <Redirect to={this.props.type === 'evolution' ? '/evolutions' : '/rattachements'} />;
    }
    return (
      <Col md="8 p-0">
        <Card>
          <CardBody>
            <Form className="form-horizontal">
              <FormGroup row>
                <Col xs="12" className="mx-auto mt-3">
                  <Label>Etablissement : </Label> {this.props.name}
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <Button
                        type="button"
                        color="primary"
                        onClick={this.onSearchChange}
                        className="col-xs-1"
                      >
                        {this.props.searchIsLoading ?
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
                      value={this.state.relationInstitutionId ?
                        this.state.relationInstitutionId : this.props.relationInstitutionId}
                    >
                      <option>{this.props.name}</option>
                      {this.renderInstitutionNameSuggestions()}
                    </select>
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="6">
                  <Label>Choisir une catégorie</Label>
                  <select
                    id="categoryId"
                    className="form-control"
                    onChange={this.onSelectorChange}
                    value={this.state.categoryId ? this.state.categoryId : this.props.categoryId}
                  >
                    {this.renderCategories()}
                    <option value="redirect">
                      Gérer les catégories
                    </option>
                  </select>
                </Col>
                <Col xs="6" className="mx-auto">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    id="date"
                    value={this.state.date ? this.state.date : this.props.date}
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
            </Form>
          </CardBody>
          <CardFooter>
            {this.props.id ?
              <Button
                className="float-left rounded mt-1"
                color="danger"
                onClick={() => this.props.toggleDeleteModal(deleteUrl)}
              >
                Supprimer
              </Button> : <div />}
            <UpdateFormButton
              hasErrored={this.props.addContentHasErrored}
              isLoading={this.props.addContentIsLoading}
              color={this.props.id ? 'secondary' : 'primary'}
              message={this.props.id ? 'Modifier la date' : 'Ajouter'}
              triggerAction={this.onClick}
            />
          </CardFooter>
        </Card>
      </Col>

    );
  }
}

RelationForm.propTypes = {
  addContent: PropTypes.func.isRequired,
  addContentHasErrored: PropTypes.bool.isRequired,
  addContentIsLoading: PropTypes.bool.isRequired,
  categories: PropTypes.array.isRequired,
  categoryId: PropTypes.number,
  date: PropTypes.string,
  deleteModal: PropTypes.bool.isRequired,
  id: PropTypes.number,
  institutions: PropTypes.array.isRequired,
  institutionId: PropTypes.number.isRequired,
  name: PropTypes.string,
  relationInstitutionId: PropTypes.number,
  relationType: PropTypes.string.isRequired,
  search: PropTypes.func.isRequired,
  searchHasErrored: PropTypes.bool.isRequired,
  searchIsLoading: PropTypes.bool.isRequired,
  setActiveItem: PropTypes.func.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

RelationForm.defaultProps = {
  categoryId: '',
  date: '',
  id: '',
  name: '',
  relationInstitutionId: '',
};

export default RelationForm;
