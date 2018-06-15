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
import UploadModal from './UploadModal';

class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      csvFile: null,
      error: false,
      initialCsvFile: null,
      initialData: {},
      institutions: {},
      isLoading: false,
      redirectToNewInstitution: false,
      searchEntry: '',
      uploadModal: false,
    };
    this.getInstitutionByPage = this.getInstitutionByPage.bind(this);
    this.search = debounce(this.search, 1000);
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.redirectToNewInstitution = this.redirectToNewInstitution.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleUploadModal = this.toggleUploadModal.bind(this);
  }

  componentWillMount() {
    this.setState({ isLoading: true });
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
          this.downloadSearchResults();
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

  search() {
    this.setState({ isLoading: true });
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
              isLoading: false,
              last: links.last,
              next: links.next,
              prev: links.prev,
              self: links.self,
            });
          });
          this.downloadSearchResults();
        } else {
          this.setState({
            error: true,
            isLoading: false,
          });
        }
      });
  }

  downloadSearchResults() {
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
              initialCsvFile: params ? this.state.initialCsvFile : csvFile,
            });
          });
        }
      });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  toggleUploadModal() {
    this.setState({
      uploadModal: !this.state.uploadModal,
    });
  }

  redirectToNewInstitution() {
    this.setState({ redirectToNewInstitution: true });
  }

  resetSearch() {
    this.setState({
      csvFile: this.state.initialCsvFile,
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
    if (this.state.redirectToNewInstitution) {
      return <NameModal toggleModal={this.toggleModal} />;
    }
    return (
      <div>
        <Row className="pt-5 pb-1">
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
          <Col xs="12" md="5">
            <Button
              type="button"
              color="primary"
              className="m-1"
              onClick={this.redirectToNewInstitution}
            >
              <i className="fa fa-plus" /> Ajouter un établissement
            </Button>
            <Button type="button" color="success" className="m-1" onClick={this.toggleUploadModal}>
              <i className="fa fa-upload" /> Importer des données (csv)
            </Button>
            {this.state.uploadModal ?
              <UploadModal
                csvTemplate={this.state.initialCsvFile}
                toggleModal={this.toggleUploadModal}
              /> : <div />}
            {this.state.csvFile && !this.state.isLoading ?
              <div>
                <a href={this.state.csvFile} download="etablissement.csv" className="btn btn-primary float-right m-1">
                  <i className="fa fa-download" /> Télécharger
                </a>
              </div> : <div />}
          </Col>
        </Row>
        {this.state.isLoading ?
          <div>
            <i className="fa fa-spinner fa-spin " />
            <span className="mx-1"> Chargement </span>
          </div> :
          <div>
            {this.state.institutions.length === 0 ?
              <p className="text-center"><em>aucun résultat</em></p> :
              <Row> {this.renderInstitutionsCards()} </Row>}
            <div className="d-flex justify-content-center">
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
              </Pagination>
            </div>
          </div>}
      </div>
    );
  }
}

export default SearchPage;
