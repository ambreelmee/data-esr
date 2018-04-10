import React, { Component } from 'react';
import { ButtonGroup, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import PropTypes from 'prop-types';

import LinkRef from './LinkRef';
import LinkDropdown from './LinkDropdown';


class LinkContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addModal: false,
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
    fetch(`${process.env.API_URL_STAGING}category_links`, {
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
    fetch(`${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          links: data.institution.links,
          isLoading: false,
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
          etablissement_id={this.props.etablissement_id}
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
      <div>
        <Row>
          {this.renderItems()}
          <ButtonGroup className="ml-4">
            <ButtonDropdown
              id="linkDropdown"
              isOpen={this.state.displayDropdown}
              toggle={this.displayDropdown}
            >
              <DropdownToggle caret color="primary" id="source" size="lg">
                <i className="fa fa-plus mr-1" />
                Ajouter un lien
              </DropdownToggle>
              <DropdownMenu>
                {this.renderDropDownItems()}
              </DropdownMenu>
            </ButtonDropdown>
          </ButtonGroup>
        </Row>
      </div>
    );
  }
}

LinkContainer.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
};

export default LinkContainer;
