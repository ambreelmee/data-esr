import React from 'react';
import PropTypes from 'prop-types';
import { Button, FormGroup, Form, InputGroup, InputGroupAddon, InputGroupText, Row, Col, Input } from 'reactstrap';

const SearchBar = props => (
  <Row>
    <Col xs="12" md="10" lg="8" className="mx-auto">
      <Form>
        <FormGroup>
          <InputGroup size="lg" className=" search border rounded my-shadow">
            <InputGroupAddon addonType="prepend">
              <InputGroupText className="border-0 rounded text-muted">
                {props.isSearching ?
                  <i className="fa fa-spinner fa-spin" /> :
                  <i className="fa fa-search" />}
              </InputGroupText>
            </InputGroupAddon>
            <Input
              id="searchEntry"
              className="col-xs-11 border-0 rounded"
              type="text"
              placeholder="Rechercher un établissement..."
              value={props.searchEntry}
              onChange={props.onChange}
              autoFocus
              onFocus={(e) => {
                const val = e.target.value;
                e.target.value = '';
                e.target.value = val;
              }}
            />
            {props.searchEntry ?
              <InputGroupAddon addonType="append">
                <Button type="button" color="light" className="border-0 rounded" onClick={props.resetSearch}>
                  <i className="fa fa-remove" />
                </Button>
              </InputGroupAddon> : <div />}
          </InputGroup>
        </FormGroup>
      </Form>
    </Col>
  </Row>
);


SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  isSearching: PropTypes.bool.isRequired,
  searchEntry: PropTypes.string.isRequired,
  resetSearch: PropTypes.func.isRequired,
};

export default SearchBar;
