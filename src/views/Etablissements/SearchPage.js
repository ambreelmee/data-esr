import React, { Component } from 'react';
import {
  Button, FormGroup, Form, InputGroup, InputGroupAddon,
  Row, Col, Input, Pagination, PaginationItem, PaginationLink,
} from 'reactstrap';
import debounce from 'lodash/debounce';
import moment from 'moment';

import { getActiveEntity, getFormattedAddress } from './methods';
import SearchPageEtablissement from './SearchPageEtablissement';
import NameModal from './Name/NameModal';


class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      error: false,
      firstPage: 1,
      institutions: {},
      isLoading: false,
      lastPage: 6,
      nextPage: 2,
      redirectToNewInstitution: false,
      previousPage: 1,
      searchEntry: '',
    };
    this.getInstitutionByPage = this.getInstitutionByPage.bind(this);
    this.getData = debounce(this.getData, 1000);
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.redirectToNewInstitution = this.redirectToNewInstitution.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    this.getInstitutionByPage(this.state.firstPage);
  }

  onClick(event) {
    event.persist()
    this.setState({ activePage: this.state[event.target.id] })
    this.getInstitutionByPage(this.state[event.target.id])
  }

  onChange(event) {
    event.preventDefault();
    this.setState({ [event.target.id]: event.target.value });
    this.getData();
  }

  getInstitutionByPage(page) {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions?page_number=${page}&page_size=20`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            this.setState({
              institutions: data,
              isLoading: false,
            });
          });
        } else {
          this.setState({
            error: true,
            isLoading: false,
          });
        }
      });
  }

  getData() {
    this.setState({ isLoading: true });
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
          isLoading: false,
        });
      });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  redirectToNewInstitution() {
    this.setState({ redirectToNewInstitution: true });
  }

  resetSearch() {
    this.setState({ searchEntry: '' });
    this.getData();
  }

  renderInstitutionsCards() {
    return this.state.institutions.map(institution => (
      <Col xs="12" md="6" lg="4" key={institution.id}>
        <SearchPageEtablissement
          address={getActiveEntity(institution.addresses) ?
            getFormattedAddress(getActiveEntity(institution.addresses)) : ' '}
          date_start={institution.date_start}
          date_end={institution.date_end}
          id={institution.id}
          name={getActiveEntity(institution.names) ? getActiveEntity(institution.names).text : institution.names[0]}
        />
      </Col>
    ));
  }

  render() {
    const locale = window.navigator.userLanguage || window.navigator.language;
    moment.locale(locale);
    if (this.state.error) {
      return <p>Une erreur est survenue</p>;
    }
    if (this.state.redirectToNewInstitution) {
      return <NameModal toggleModal={this.toggleModal} />;
    }
    return (
      <div>
        <Row className="py-5">
          <Col md="6" className="mx-auto">
            <Form>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <Button
                      type="button"
                      color="primary"
                      onClick={this.onChange}
                      className="col-xs-1"
                    >
                      {this.state.isLoading ?
                        <i className="fa fa-spinner fa-spin" /> :
                        <i className="fa fa-search" />}
                    </Button>
                  </InputGroupAddon>
                  <Input
                    id="searchEntry"
                    className="col-xs-11"
                    type="text"
                    placeholder="Rechercher un établissement..."
                    value={this.state.searchEntry}
                    onChange={this.onChange}
                    autoFocus
                    onFocus={(e) => {
                      const val = e.target.value;
                      e.target.value = '';
                      e.target.value = val;
                    }}
                  />
                  <InputGroupAddon addonType="append">
                    {this.state.searchEntry ?
                      <Button type="button" color="secondary" onClick={this.resetSearch}>
                        <i className="fa fa-remove" />
                      </Button> : <div />}
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Form>
          </Col>
          <Col xs="12" md="4">
            <Button
              type="button"
              color="primary"
              className="col-xs-1"
              onClick={this.redirectToNewInstitution}
            >
              <i className="fa fa-plus" /> Ajouter un établissement
            </Button>
          </Col>
        </Row>
        {this.state.isLoading ?
          <div>
            <i className="fa fa-spinner fa-spin " />
            <span className="mx-1"> Chargement </span>
          </div> :
          <Row>
            {this.renderInstitutionsCards()}
          </Row>}
        <Row>
          <Pagination>
            {this.state.activePage === this.state.firstPage ? <div /> :
            <PaginationItem>
              <PaginationLink id="firstPage" onClick={this.onClick}>
                {this.state.firstPage}
              </PaginationLink>
            </PaginationItem>}
            {this.state.activePage - this.state.firstPage < 2 ? <div /> :
            <PaginationItem disabled>
              <PaginationLink>
                ...
              </PaginationLink>
            </PaginationItem>}
            {this.state.previousPage === this.state.firstPage ? <div /> :
            <PaginationItem>
              <PaginationLink id="previousPage" onClick={this.onClick}>
                {this.state.previousPage}
              </PaginationLink>
            </PaginationItem>}
            <PaginationItem active>
              <PaginationLink id="activePage" onClick={this.onClick}>
                {this.state.activePage}
              </PaginationLink>
            </PaginationItem>
            {this.state.nextPage === this.state.lastPage ? <div /> :
            <PaginationItem>
              <PaginationLink id="nextPage" onClick={this.onClick}>
                {this.state.nextPage}
              </PaginationLink>
            </PaginationItem>}
            {this.state.lastPage - this.state.firstPage < 2 ? <div /> :
            <PaginationItem disabled>
              <PaginationLink>
                ...
              </PaginationLink>
            </PaginationItem>}
            {this.state.activePage === this.state.lastPage ? <div /> :
            <PaginationItem>
              <PaginationLink id="lastPage" onClick={this.onClick}>
                {this.state.lastPage}
              </PaginationLink>
            </PaginationItem>}
          </Pagination>
        </Row>
      </div>
    );
  }
}

export default SearchPage;
