import React, { Component } from 'react';
import {
  Button, FormGroup, Form, InputGroup, InputGroupAddon,
  Row, Col, Input,
} from 'reactstrap';
import debounce from 'lodash/debounce';

import { getActiveEntity, getFormattedAddress } from './methods';
import SearchPageEtablissement from './SearchPageEtablissement';


class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      institutions: {},
      isLoading: false,
      searchEntry: '',
    };
    this.onChange = this.onChange.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
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

  resetSearch() {
    this.setState({ searchEntry: '' });
    this.getData();
  }

  renderInstitutionsCards() {
    return this.state.institutions.map(institution => (
      <Col md="4" key={institution.id}>
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
    return (
      <div>
        <Form className="m-5 form-inline justify-content-center">
          <FormGroup row className="w-75">
            <Col md="12">
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <Button type="button" color="primary" onClick={this.getData}>
                    <i className="fa fa-search" /> Rechercher
                  </Button>
                </InputGroupAddon>
                <Input
                  id="searchEntry"
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
            </Col>
          </FormGroup>
        </Form>
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
