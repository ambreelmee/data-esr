import React, { Component } from 'react';
import {
  Card, CardBody, CardHeader, ButtonGroup, ButtonDropdown, DropdownItem,
  DropdownMenu, DropdownToggle, Row
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import map from 'lodash/map';

import Code from './Code';
import CodeDropdown from './CodeDropdown';

const addons = [
  { link: 'https://www.wikidata.org/entity', category: 'Wikidata' },
  { link: 'https://www.grid.ac/institutes', category: 'GRID' },
  { link: 'http://isni.org/isni', category: 'Isni' },
];

const getAddons = category => addons.find(item => item.category === category);

class CodeContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryCodes: [],
      codesByCategory: {},
      displayDropdown: false,
      categoriesWithoutCode: [],
      isLoading: false,
      codes: {},
    };
    this.displayDropdown = this.displayDropdown.bind(this);
    this.getCodes = this.getCodes.bind(this);
    this.redirectToCategories = this.redirectToCategories.bind(this);
  }

  componentWillMount() {
    this.getCodes();
  }

  getCategoryCodes() {
    fetch(`${process.env.API_URL_STAGING}code_categories`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        const categoriesWithoutCode = data.filter(category =>
          !Object.keys(this.state.codesByCategory).includes(category.title));
        this.setState({
          categoryCodes: data,
          categoriesWithoutCode,
          isLoading: false,
        });
      });
  }

  getCodes() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}/codes`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        const codesByCategory = {};
        data.map((code) => {
          if (!codesByCategory[code.category]) {
            codesByCategory[code.category] = [];
          }
          codesByCategory[code.category].push(code);
          return codesByCategory;
        });
        this.setState({
          codes: data,
          displayDropdown: false,
          codesByCategory,
        });
        this.getCategoryCodes();
      });
  }
  displayDropdown(event) {
    if (event.target.id === 'source-code') {
      this.setState({
        displayDropdown: !this.state.displayDropdown,
      });
    }
  }

  redirectToCategories() {
    this.setState({
      redirectToCategories: !this.state.redirectToCategories,
    });
  }


  renderDropDownItems() {
    return this.state.categoriesWithoutCode.map(category => (
      <CodeDropdown
        key={`code-${category.id}`}
        categoryId={category.id}
        category={category.title}
        etablissement_id={this.props.etablissement_id}
        getCodes={this.getCodes}
      />
    ));
  }

  renderItems() {
    return map(this.state.codesByCategory, ((codes) => {
      const activeCode = codes.find(code => code.status === 'active');
      if (activeCode) {
        return (
          <Code
            key={`active-code-${activeCode.id}`}
            addons={getAddons(activeCode.category)}
            content={activeCode.content}
            category={activeCode.category}
            categoryId={(this.state.categoryCodes.find(category => category.title === activeCode.category)).id}
            date_end={activeCode.date_end}
            date_start={activeCode.date_start}
            etablissement_id={this.props.etablissement_id}
            id={activeCode.id}
            getCodes={this.getCodes}
            history={codes}
            status={activeCode.status}
          />);
      }
      return (
        <Code
          key={`code-${codes[0].id}`}
          addons={getAddons(codes[0].category)}
          content={codes[0].content}
          category={codes[0].category}
          categoryId={(this.state.categoryCodes.find(category => category.title === codes[0].category)).id}
          date_end={codes[0].date_end}
          date_start={codes[0].date_start}
          etablissement_id={this.props.etablissement_id}
          id={codes[0].id}
          getCodes={this.getCodes}
          status={codes[0].status}
          history={codes}
        />);
    }));
  }

  render() {
    if (this.state.isLoading) {
      return <p />;
    }
    if (this.state.redirectToCategories) {
      return <Redirect to="/categories" />;
    }
    return (
      <Card className="mt-2 w-100">
        <CardHeader>
          Identifiants référentiels
        </CardHeader>
        <CardBody>
          {this.renderItems()}
          {this.state.codes.length === 0 ? <em>Aucun code enregistré actuellement...<br /></em> : <div />}
          {this.state.categoriesWithoutCode.length > 0 ?
            <ButtonGroup className="float-right">
              <ButtonDropdown
                id="codeDropdown"
                isOpen={this.state.displayDropdown}
                toggle={this.displayDropdown}
              >
                <DropdownToggle caret color="primary" id="source-code">
                  <i className="fa fa-plus mr-1" />
                  Ajouter un code
                </DropdownToggle>
                <DropdownMenu>
                  {this.renderDropDownItems()}
                  <DropdownItem onClick={this.redirectToCategories}>
                    Gérer les codes...
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </ButtonGroup> : <div />}
        </CardBody>
      </Card>
    );
  }
}

CodeContainer.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
};

export default CodeContainer;
