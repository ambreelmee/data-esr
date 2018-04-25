import React, { Component } from 'react';
import {
  Button, FormGroup, Form, InputGroup, InputGroupAddon,
  Row, Col, Input, Pagination, PaginationItem, PaginationLink,
} from 'reactstrap';
import debounce from 'lodash/debounce';
import moment from 'moment';
import parse from 'parse-link-header';

import { getActiveEntity, getFormattedAddress } from './methods';
import SearchPageEtablissement from './SearchPageEtablissement';
import NameModal from './Name/NameModal';


class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      institutions: {},
      isLoading: false,
      redirectToNewInstitution: false,
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
    this.getInstitutionByPage();
  }

  onClick(event) {
    event.persist()
    if (this.state[event.target.id]) {
      this.getInstitutionByPage(this.state[event.target.id])
    } else {
      this.getInstitutionByPage()
    }
  }

  onChange(event) {
    event.preventDefault();
    this.setState({ [event.target.id]: event.target.value });
    this.getData();
  }

  getInstitutionByPage(page) {
    this.setState({ isLoading: true });
    let url = '';
    if (page) {
      url = page.url
    }
    else {
      url = `${process.env.API_URL_STAGING}institutions`;
    }
    fetch(url, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (response.ok) {
          const links = parse(response.headers.get('Link'))
          response.json().then((data) => {
            this.setState({

              institutions: data,
              isLoading: false,
              last: links.last,
              next: links.next,
              prev: links.prev,
              self: links.self,
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
    if (this.state.isLoading) {
      return <p>Chargement...</p>
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
            {this.state.self && this.state.self.page_number !== "1" ?
              <PaginationItem>
                <PaginationLink id="first" onClick={this.onClick}>
                  1
                </PaginationLink>
              </PaginationItem> : <div />}
            {this.state.self && parseInt(this.state.self.page_number, 10) > 2 ?
              <PaginationItem disabled>
                <PaginationLink>
                  ...
                </PaginationLink>
              </PaginationItem> : <div />}
            {this.state.prev && this.state.prev.page_number !== "1" ?
              <PaginationItem>
                <PaginationLink id="prev" onClick={this.onClick}>
                  {this.state.prev.page_number}
                </PaginationLink>
              </PaginationItem> : <div />}
            <PaginationItem active>
              <PaginationLink id="self" onClick={this.onClick}>
                {this.state.self.page_number}
              </PaginationLink>
            </PaginationItem>
            {this.state.next && this.state.next.page_number !== this.state.last.page_number ?
              <PaginationItem>
                <PaginationLink id="next" onClick={this.onClick}>
                  {this.state.next.page_number}
                </PaginationLink>
              </PaginationItem> : <div />}
            {this.state.last && parseInt(this.state.last.page_number, 10) - parseInt(this.state.self.page_number, 10) > 2 ?
              <PaginationItem disabled>
                <PaginationLink>
                  ...
                </PaginationLink>
              </PaginationItem> : <div /> }
            {this.state.last && this.state.self.page_number !== this.state.last.page_number ?
              <PaginationItem>
                <PaginationLink id="last" onClick={this.onClick}>
                  {this.state.last.page_number}
                </PaginationLink>
              </PaginationItem> : <div />}
          </Pagination>
        </Row>
      </div>
    );
  }
}

export default SearchPage;
