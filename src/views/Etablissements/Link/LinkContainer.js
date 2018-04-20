import React, { Component } from 'react';
import {
  Card, CardBody, CardHeader, ButtonGroup, ButtonDropdown, DropdownMenu,
  DropdownItem, DropdownToggle, Row
} from 'reactstrap';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import LinkRef from './LinkRef';
import LinkDropdown from './LinkDropdown';

const icons = [
  { class: 'fa fa-youtube', category: 'youtube' },
  { class: 'fa fa-facebook', category: 'facebook' },
  { class: 'fa fa-wikipedia-w', category: 'wikipedia' },
  { class: 'fa fa-twitter', category: 'twitter' },
  { class: 'fa fa-tumblr', category: 'tumblr' },
  { class: 'fa fa-linkedin', category: 'linkedin' },
];

const getCategoryClass = category => icons.find(item => item.category.toLowerCase().includes(category));

class LinkContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryLinks: [],
      displayDropdown: false,
      emptyCategories:[],
      isLoading: false,
      links: [],
      redirectToCategories : false,
    };
    this.displayDropdown = this.displayDropdown.bind(this);
    this.getLinks = this.getLinks.bind(this);
    this.getCategoryLinks = this.getCategoryLinks.bind(this);
    this.redirectToCategories = this.redirectToCategories.bind(this);
  }

  componentWillMount() {
    this.getLinks();
  }


  getCategoryLinks() {
    fetch(`${process.env.API_URL_STAGING}link_categories`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        const emptyCategories = data.filter(category =>
          !this.state.links.some(code => category.title === code.category));
        this.setState({
          categoryLinks: data,
          emptyCategories,
          isLoading: false,
        });
      });
  }

  getLinks() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}/links`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          links: data,
          displayDropdown: false,
        });
        this.getCategoryLinks();
      });
  }
  displayDropdown(event) {
    if (event.target.id === 'source-link') {
      this.setState({
        displayDropdown: !this.state.displayDropdown,
      });
    }
  }

  redirectToCategories() {
    this.setState({
      redirectToCategories: !this.state.redirectToCategories
    });
  }

  renderDropDownItems() {
    return this.state.emptyCategories.map(category => (
      <LinkDropdown
        key={category.id}
        categoryId={category.id}
        category={category.title}
        className={getCategoryClass(category.title) ? getCategoryClass(category.title).class : ''}
        etablissement_id={this.props.etablissement_id}
        getLinks={this.getLinks}
      />
    ));
  }

  renderItems() {
    return this.state.links.map(link =>
      (
        <LinkRef
          key={link.id}
          content={link.content}
          category={link.category}
          categoryId={(this.state.categoryLinks.find(category => category.title === link.category)).id}
          className={getCategoryClass(link.category) ? getCategoryClass(link.category).class : null}
          id={link.id}
          getLinks={this.getLinks}
        />
      ));
  }

  render() {
    if (this.state.isLoading) {
      return <p>Loading...</p>;
    }
    if (this.state.redirectToCategories) {
      return <Redirect to="/categories" />;
    }
    return (
      <Row className="my-2">
        <Card className="mt-2">
          <CardHeader>
            Présence sur le web
          </CardHeader>
          <CardBody>
            {this.renderItems()}
            {this.state.links.length === 0 ? <em>Aucun lien enregistré actuellement...<br /></em> : <div />}
            {this.state.emptyCategories.length > 0 ?
              <ButtonGroup className="float-right">
                <ButtonDropdown
                  id="linkDropdown"
                  isOpen={this.state.displayDropdown}
                  toggle={this.displayDropdown}
                >
                  <DropdownToggle caret color="primary" id="source-link">
                    <i className="fa fa-plus mr-1" />
                    Ajouter un lien
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.renderDropDownItems()}
                    <DropdownItem onClick={this.redirectToCategories}>
                      Gérer les liens...
                    </DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </ButtonGroup> : <div />}
          </CardBody>
        </Card>
      </Row>
    );
  }
}

LinkContainer.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
};

export default LinkContainer;
