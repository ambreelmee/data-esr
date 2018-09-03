import React, { Component } from 'react';
import { Card, CardBody, Col, ButtonGroup, ButtonDropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const icons = [
    { class: 'fa fa-youtube fa-2x text-dark', category: 'youtube' },
  { class: 'fa fa-facebook fa-2x text-dark', category: 'facebook' },
  { class: 'fa fa-wikipedia-w fa-2x text-dark', category: 'wikipedia' },
  { class: 'fa fa-twitter fa-2x text-dark', category: 'twitter' },
  { class: 'fa fa-tumblr fa-2x text-dark', category: 'tumblr' },
  { class: 'fa fa-linkedin fa-2x text-dark', category: 'linkedin' },
  { class: 'fa fa-instagram fa-2x text-dark', category: 'instagram' },
];

const getCategoryClass = category => icons.find(item => item.category.toLowerCase().includes(category));

class LinkCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayDropdown: false,
    };
    this.displayDropdown = this.displayDropdown.bind(this);
  }

  displayDropdown() {
    this.setState({
      displayDropdown: !this.state.displayDropdown,
    });
  }

  renderLinks() {
    return this.props.links.map((link) => {
      if (link.category === 'website') {
        return '';
      }
      const className = getCategoryClass(link.category);
      return (
        <Card className="mb-1 ml-1 p-3 text-center rounded" style={{ 'background-color': '#BFCFFF' }}>
          <a
            href={link.content.substring(0, 4) === 'http' ? link.content : `//${link.content}`}
            target="blank"
          >
            {className ?
              <i className={className.class} /> :
              <h6 className="mb-0 text-dark">{link.category}</h6>}
          </a>
        </Card>);
    });
  }


  render() {
    const website = this.props.links.find(link => link.category === 'website');
    if (website) {
      return (
        <Row>
          <Col md="5" className="pr-0 pb-1">
            <Card className="mb-1 text-center w-100 h-100 rounded" style={{ 'background-color': '#BFCFFF' }}>
              <ButtonGroup style={{ position: 'absolute', right: '10px', top: '5px' }}>
                <ButtonDropdown
                  isOpen={this.state.displayDropdown}
                  toggle={this.displayDropdown}
                >
                  <DropdownToggle className="p-0" color="transparent">
                    <i className="fa fa-pencil text-dark" />
                  </DropdownToggle>
                  <DropdownMenu className="rounded">
                    <NavLink
                      to={`/etablissements/${this.props.institutionId}/liens/`}
                      className="dropdown-item rounded alert-secondary"
                    >
                        Gérer les sites web
                    </NavLink>
                  </DropdownMenu>
                </ButtonDropdown>
              </ButtonGroup>
              <CardBody className="pb-0">
                <a
                  href={website.content.substring(0, 4) === 'http' ? website.content : `//${website.content}`}
                  target="blank"
                  className="text-dark"
                >
                  <i className="mb-1 fa fa-mouse-pointer fa-2x" />
                  <h5>Voir le site web</h5>
                </a>
              </CardBody>
            </Card>
          </Col>
          <Col md="7" className="pl-0 d-flex flex-wrap align-content-start">
            {this.renderLinks()}
          </Col>
        </Row>
      );
    }
    return (
      <Row>
        <Col md="6" className="pr-1">
          <NavLink
            to={`/etablissements/${this.props.institutionId}/liens/`}
            className="mb-0 p-2 text-center w-100 h-100 rounded card bg-primary"
          >
            <CardBody>
              <i className="mb-1 fa fa-mouse-pointer fa-2x" />
              <h5>Ajouter un site web</h5>
            </CardBody>
          </NavLink>
        </Col>
        <Col md="6" className="p-0 d-flex flex-wrap align-content-start">
          {this.renderLinks()}
        </Col>
      </Row>);
  }
}

LinkCard.propTypes = {
  links: PropTypes.string.isRequired,
  institutionId: PropTypes.number.isRequired,
};

export default LinkCard;
