import React, { Component } from 'react';
import { Card, CardBody, CardHeader, ButtonGroup, ButtonDropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import PropTypes from 'prop-types';

import LinkRef from './LinkRef';
import LinkDropdown from './LinkDropdown';

const icons = [
  { class: 'fa fa-youtube', category: 'Page Youtube' },
  { class: 'fa fa-facebook', category: 'Page facebook' },
  { class: 'fa fa-wikipedia-w', category: 'Page Wikipedia' },
  { class: 'fa fa-twitter', category: 'Twitter' },
  { class: 'fa fa-tumblr', category: 'Tumbler' },
  { class: 'fa fa-linkedin', category: 'Linkedin' },
  { class: 'fa fa-at', category: 'Site internet' },
];

const getCategoryClass = category => (icons.find(item => item.category === category)).class;

class LinkContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryLinks: [],
      displayDropdown: false,
      isLoading: false,
      links: {},
    };
    this.displayDropdown = this.displayDropdown.bind(this);
    this.getLinks = this.getLinks.bind(this);
  }

  componentWillMount() {
    this.getLinks();
    this.getCategoryLinks();
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
        this.setState({
          categoryLinks: data,
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
          isLoading: false,
          displayDropdown: false,
        });
      });
  }
  displayDropdown(event) {
    if (event.target.id === 'source') {
      this.setState({
        displayDropdown: !this.state.displayDropdown,
      });
    }
  }

  renderDropDownItems() {
    return this.state.categoryLinks.map(category => (
      <LinkDropdown
        key={category.id}
        categoryId={category.id}
        category={category.title}
        className={getCategoryClass(category.title)}
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
          className={getCategoryClass(link.category)}
          id={link.id}
          getLinks={this.getLinks}
        />
      ));
  }

  render() {
    if (this.state.isLoading) {
      return <p>Loading...</p>;
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
            <ButtonGroup className="float-right">
              <ButtonDropdown
                id="linkDropdown"
                isOpen={this.state.displayDropdown}
                toggle={this.displayDropdown}
              >
                <DropdownToggle caret color="primary" id="source">
                  <i className="fa fa-plus mr-1" />
                  Ajouter un lien
                </DropdownToggle>
                <DropdownMenu>
                  {this.renderDropDownItems()}
                </DropdownMenu>
              </ButtonDropdown>
            </ButtonGroup>
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
