import React, { Component } from 'react';
import {
  Card, CardBody, CardHeader, ButtonGroup, ButtonDropdown, DropdownMenu,
  DropdownItem, DropdownToggle,
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
      redirectToLinks: false,
    };
    this.displayDropdown = this.displayDropdown.bind(this);
    this.getLinks = this.getLinks.bind(this);
    this.getCategoryLinks = this.getCategoryLinks.bind(this);
    this.redirectToLinks = this.redirectToLinks.bind(this);
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

  redirectToLinks() {
    this.setState({
      redirectToLinks: !this.state.redirectToLinks,
    });
  }

  renderDropDownItems() {
    return this.state.emptyCategories.map(category => (
      <LinkDropdown
        key={`${category.id}-${category.title}`}
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
      return <p />;
    }
    if (this.state.redirectToLinks) {
      return <Redirect to="/liens" />;
    }
    return (
      <Card className="mt-2 w-100">
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
                <DropdownToggle caret size="sm" color="primary" className="rounded" id="source-link">
                  <i className="fa fa-plus mr-1" />
                  Ajouter un lien
                </DropdownToggle>
                <DropdownMenu>
                  {this.renderDropDownItems()}
                  <DropdownItem onClick={this.redirectToLinks}>
                    Gérer les liens...
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </ButtonGroup> : <div />}
        </CardBody>
      </Card>
    );
  }
}

LinkContainer.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
};

export default LinkContainer;
