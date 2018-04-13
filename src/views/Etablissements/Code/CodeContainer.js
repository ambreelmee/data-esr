import React, { Component } from 'react';
import { Card, CardBody, CardHeader, ButtonGroup, ButtonDropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import PropTypes from 'prop-types';

import Code from './Code';
import CodeDropdown from './CodeDropdown';

const addons = [
  { link: 'https://www.wikidata.org/entity/', category: 'Wikidata', color: 'info' },
  { link: 'https://www.grid.ac/institutes/', category: 'Grid', color: 'primary' },
  { link: 'http://isni.org/isni/', category: 'Isni', color: 'info' },
  { link: '', category: 'UAI', color: 'warning' },
  { link: '', category: 'Siret', color: 'success' },
  { link: '', category: 'Eter', color: 'danger' },
];

const getAddons = category => addons.find(item => item.category === category);

class CodeContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryCodes: [],
      displayDropdown: false,
      emptyCategories:[],
      isLoading: false,
      codes: {},
    };
    this.displayDropdown = this.displayDropdown.bind(this);
    this.getCodes = this.getCodes.bind(this);
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
        const emptyCategories = data.filter(category =>
          !this.state.codes.some(code => category.title === code.category));
        this.setState({
          categoryCodes: data,
          emptyCategories,
          isLoading: false,
        });
      });
  }

  getCodes() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          codes: data.institution.codes,
          displayDropdown: false,
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


  renderDropDownItems() {
    return this.state.emptyCategories.map(category => (
      <CodeDropdown
        key={category.id}
        categoryId={category.id}
        category={category.title}
        etablissement_id={this.props.etablissement_id}
        getCodes={this.getCodes}
      />
    ));
  }

  renderItems() {
    return this.state.codes.map(code =>
      (
        <Code
          key={code.id}
          addons={getAddons(code.category)}
          content={code.content}
          category={code.category}
          categoryId={(this.state.categoryCodes.find(category => category.title === code.category)).id}
          date_end={code.date_end}
          date_start={code.date_start}
          etablissement_id={this.props.etablissement_id}
          id={code.id}
          getCodes={this.getCodes}
        />
      ));
  }

  render() {
    if (this.state.isLoading) {
      return <p>Loading...</p>;
    }
    return (
      <Card className="mt-2">
        <CardHeader>
          Identifiants référentiels
        </CardHeader>
        <CardBody>
          <Row>
            {this.renderItems()}
          </Row>
          {this.state.codes.length === 0 ? <em>Aucun code enregistré actuellement...<br /></em> : <div />}
          {this.state.emptyCategories.length > 0 ?
            <ButtonGroup className="float-right">
              <ButtonDropdown
                id="codeDropdown"
                isOpen={this.state.displayDropdown}
                toggle={this.displayDropdown}
              >
                <DropdownToggle caret color="primary" id="source-code">
                  <i className="fa fa-plus mr-1" />
                  Ajouter un lien
                </DropdownToggle>
                <DropdownMenu>
                  {this.renderDropDownItems()}
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
