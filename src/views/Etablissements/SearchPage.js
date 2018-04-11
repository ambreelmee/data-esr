import React, { Component } from 'react';
import {
  Button, FormGroup, Form, InputGroup, InputGroupAddon,
  Row, Col, Input,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import debounce from 'lodash/debounce';

import { getActiveEntity, getFormattedAddress } from './methods';
import SearchPageEtablissement from './SearchPageEtablissement';
import NameModal from './Name/NameModal';


class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      institutions: {},
      isLoading: false,
      searchEntry: '',
      redirectToNewInstitution : false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.onChange = this.onChange.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.redirectToNewInstitution = this.redirectToNewInstitution.bind(this);
    this.getData = debounce(this.getData, 1000);
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    this.getData();
  }


  onChange(event) {
    event.preventDefault();
    this.setState({ [event.target.id]: event.target.value });
    this.getData();
  }

  toggleModal() {
    this.setState({
      odal: !this.state.modal,
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
          name={getActiveEntity(institution.names).text}
        />
      </Col>
    ));
  }

  render() {
    if (this.state.redirectToNewInstitution) {
      return <NameModal toggleModal={this.toggleModal} />
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
                      onClick={this.getData}
                      className="col-xs-1"
                    >
                      <i className="fa fa-search" />
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
      </div>
    );
  }
}

export default SearchPage;
