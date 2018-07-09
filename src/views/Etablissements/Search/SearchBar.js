import React, { Component } from 'react';
import {
  Button, FormGroup, Form, InputGroup, InputGroupAddon, InputGroupText,
  Row, Col, Input,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: this.props.searchValue,
    };
    this.search = debounce(this.props.search, 1000);
    this.onChange = this.onChange.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
  }

  onChange(event) {
    const searchValue = event.target.value;
    event.preventDefault();
    this.setState({ searchValue });
    this.search(searchValue);
  }

  resetSearch() {
    this.setState({ searchValue: '' });
    this.props.resetSearch();
  }

  render() {
    if (this.props.searchValue && !this.props.searchPage) {
      return <Redirect to="/etablissements" />
    }
    return (
      <div className="p-5">
        <Row>
          <Col xs="12" md="10" lg="8" className="mx-auto">
            <Form>
              <FormGroup>
                <InputGroup size="lg" className=" search border rounded my-shadow">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="border-0 rounded text-muted">
                      {this.props.isSearching ?
                        <i className="fa fa-spinner fa-spin" /> :
                        <i className="fa fa-search" />}
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="searchValue"
                    className="col-xs-11 border-0 rounded"
                    type="text"
                    placeholder="Rechercher un établissement..."
                    value={this.state.searchValue}
                    onChange={this.onChange}
                    autoFocus
                    onFocus={(e) => {
                      const val = e.target.value;
                      e.target.value = '';
                      e.target.value = val;
                    }}
                  />
                  {this.props.searchValue ?
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
      </div>
    );
  }
}


SearchBar.propTypes = {
  isSearching: PropTypes.bool,
  resetSearch: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
  searchPage: PropTypes.bool,
};

SearchBar.defaultProps = {
  isSearching: false,
  searchValue: '',
  searchPage: true,
};

export default SearchBar;
