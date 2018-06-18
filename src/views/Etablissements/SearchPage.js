import React, { Component } from 'react';
import {
  Button, FormGroup, Form, InputGroup, InputGroupAddon, InputGroupText,
  Row, Col, Input, Pagination, PaginationItem, PaginationLink, Tooltip,
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
      addModal: false,
      addTooltip: false,
      csvFile: null,
      error: false,
      initialData: [],
      institutions: [],
      isDownloading: false,
      isLoading: false,
      isSearching: false,
      searchEntry: '',
      uploadModal: false,
    };
    this.downloadSearchResults = this.downloadSearchResults.bind(this);
    this.getInstitutionByPage = this.getInstitutionByPage.bind(this);
    this.search = debounce(this.search, 1000);
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleAddTooltip = this.toggleAddTooltip.bind(this);
  }

  componentWillMount() {
    this.getInitialData();
  }

  onClick(event) {
    event.persist();
    if (this.state[event.target.id]) {
      this.getInstitutionByPage(this.state[event.target.id]);
    } else {
      this.getInstitutionByPage();
    }
  }

  onChange(event) {
    event.preventDefault();
    this.setState({ [event.target.id]: event.target.value });
    this.search();
  }

  getInitialData() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions?page_size=18`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (response.ok) {
          const links = parse(response.headers.get('Link'));
          response.json().then((data) => {
            this.setState({
              initialData: data,
              institutions: data,
              initialLinks: links,
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

  getInstitutionByPage(page) {
    this.setState({ isLoading: true });
    if (page) {
      const { url } = page;
      fetch(url, {
        method: this.state.searchEntry ? 'POST' : 'GET',
        headers: new Headers({
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      })
        .then((response) => {
          if (response.ok) {
            const links = parse(response.headers.get('Link'));
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
    } else {
      this.setState({
        isLoading: false,
        institutions: this.state.initialData,
      });
    }
  }

  toggleAddTooltip() {
    this.setState({
      addTooltip: !this.state.addTooltip,
    });
  }

  search() {
    this.setState({ isSearching: true });
    const params = encodeURI(this.state.searchEntry);
    fetch(`${process.env.API_URL_STAGING}institutions/search?q=${params}&page_size=18`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (response.ok) {
          const links = parse(response.headers.get('Link'));
          response.json().then((data) => {
            this.setState({
              institutions: data,
              isSearching: false,
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

  downloadSearchResults() {
    this.setState({ isDownloading: true });
    const params = encodeURI(this.state.searchEntry);
    fetch(`${process.env.API_URL_STAGING}institutions/search?q=${params}&download=true`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.blob().then((data) => {
            const csvFile = URL.createObjectURL(data);
            this.setState({
              csvFile,
              isDownloading: false,
            });
          });
        }
      });
  }

  toggleAddModal() {
    this.setState({ addModal: !this.state.addModal });
  }

  resetSearch() {
    this.setState({
      institutions: this.state.initialData,
      searchEntry: '',
      last: this.state.initialLinks.last,
      next: this.state.initialLinks.next,
      prev: this.state.initialLinks.prev,
      self: this.state.initialLinks.self,
    });
  }

  renderInstitutionsCards() {
    return this.state.institutions.map((institution) => {
      const codeUAI = institution.codes.find(code => code.category === 'uai' && code.status === 'active');
      return (
        <Col xs="12" md="6" lg="4" className="my-1 px-1" key={`institution-${institution.id}`}>
          <SearchPageEtablissement
            address={getActiveEntity(institution.addresses) ?
              getFormattedAddress(getActiveEntity(institution.addresses)) : ' '}
            codeUAI={codeUAI ? codeUAI.content : ''}
            date_start={institution.date_start}
            date_end={institution.date_end}
            id={institution.id}
            name={getActiveEntity(institution.names) ? getActiveEntity(institution.names) : institution.names[0]}
            tags={institution.tags}
          />
        </Col>
      );
    });
  }

  render() {
    const locale = window.navigator.userLanguage || window.navigator.language;
    moment.locale(locale);
    if (this.state.error) {
      return <p>Une erreur est survenue</p>;
    }
    return (
      <div className="p-5">
        <Row>
          <Col xs="12" md="10" lg="8" className="mx-auto">
            <Form>
              <FormGroup>
                <InputGroup className="border rounded my-shadow">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="border-0 rounded text-muted">
                      {this.state.isSearching ?
                        <i className="fa fa-spinner fa-spin" /> :
                        <i className="fa fa-search" />}
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="searchEntry"
                    className="col-xs-11 border-0 rounded"
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
                  {this.state.searchEntry ?
                    <InputGroupAddon addonType="append">
                      <Button type="button" color="light" className="border-0 rounded" onClick={this.resetSearch}>
                        <i className="fa fa-remove" />
                      </Button>
                    </InputGroupAddon> : <div />}
                </InputGroup>
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row className="d-flex flex-row-reverse p-1 mt-2">
          {!this.state.isSearching ?
            <div>
              {this.state.csvFile ?
                <a href={this.state.csvFile} download="etablissements.csv">
                  établissements.csv
                </a> :
                <Button color="primary" size="sm" className="rounded ml-1" onClick={this.downloadSearchResults}>
                  {!this.state.isDownloading ?
                    <div><i className="fa fa-download" /> Télécharger les résultats</div> :
                    <div><i className="fa fa-spinner fa-spin" /> Chargement</div>}
                </Button>}
            </div> : <div />}
        </Row>
        {this.state.institutions.length === 0 && !this.state.isLoading ?
          <p className="text-center"><em>aucun résultat</em></p> :
          <Row> {this.renderInstitutionsCards()} </Row>}
        <div className="mt-3 d-flex justify-content-center">
          {this.state.institutions.length > 17 ?
            <Pagination>
              {this.state.self && this.state.self.page_number !== '1' &&
                this.state.prev && this.state.prev.page_number !== '1' ?
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
              {this.state.prev ?
                <PaginationItem>
                  <PaginationLink id="prev" onClick={this.onClick}>
                    {this.state.prev.page_number}
                  </PaginationLink>
                </PaginationItem> : <div />}
              {this.state.self && this.state.institutions.length > 0 ?
                <PaginationItem active>
                  <PaginationLink id="self" onClick={this.onClick}>
                    {this.state.self.page_number}
                  </PaginationLink>
                </PaginationItem> : <div />}
              {this.state.next && this.state.next.page_number !== this.state.last.page_number ?
                <PaginationItem>
                  <PaginationLink id="next" onClick={this.onClick}>
                    {this.state.next.page_number}
                  </PaginationLink>
                </PaginationItem> : <div />}
              {this.state.last &&
                parseInt(this.state.last.page_number, 10) - parseInt(this.state.self.page_number, 10) > 2 ?
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
            </Pagination> : <div />}
        </div>
        <Button
          type="button"
          color="primary"
          className="float-add"
          id="search-page-add-button"
          onClick={this.toggleAddModal}
        >
          <i className="fa fa-plus my-float" />
        </Button>
        <Tooltip
          isOpen={this.state.addTooltip}
          target="search-page-add-button"
          toggle={this.toggleAddToolTip}
        >
          Ajouter un établissement
        </Tooltip>
        {this.state.addModal ?
          <NameModal toggleModal={this.toggleAddModal} /> : <div />}
      </div>
    );
  }
}

export default SearchPage;
