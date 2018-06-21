import React, { Component } from 'react';
import { Badge, Button, Card, CardBody } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

class SearchPageEtablissement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayInstitutionPage: false,
    };
    this.displayInstitutionPage = this.displayInstitutionPage.bind(this);
  }

  displayInstitutionPage() {
    this.setState({
      displayInstitutionPage: true,
    });
  }

  renderTags() {
    return this.props.tags.map(tag => (
      <Badge key={`${this.props.name.initials}-tag-${tag.id}`} pill color="warning" className="mx-1">
        {tag.short_label}
      </Badge>));
  }

  render() {
    if (this.state.displayInstitutionPage) {
      return <Redirect to={`/etablissements/${this.props.id}`} />;
    }
    return (
      <Card className={`mb-2 rounded my-shadow w-100 h-100 card-accent-${!this.props.date_end ? 'primary' : 'danger'}`}>
        <CardBody className="px-3 py-1 d-flex flex-column justify-content-center">
          <Button
            color="transparent"
            className={!this.props.date_end ? 'text-primary' : 'text-danger'}
            style={{ whiteSpace: 'normal', textAlign: 'left' }}
            onClick={this.displayInstitutionPage}
          >
            <h4 className="mb-0">{this.props.name.initials}
              {this.props.name.initials === this.props.name.text ? '' : ` - ${this.props.name.text.toProperCase()}`}
            </h4>
          </Button><br />
          {this.props.codeUAI ?
            <div>
              <i className="fa fa-th text-secondary mr-1" />
              <strong>{this.props.codeUAI}</strong><br />
            </div> : <div />}
          {this.props.address.length > 1 ?
            <div>
              <i className="fa fa-map-marker fa-lg mr-1" />
              {this.props.address.toProperCase()}<br />
            </div> : <div />}
          {this.props.tags.length > 0 ? <div> {this.renderTags()} <br /></div> : <div />}
          {this.props.date_end ?
            <span className="text-danger">
              fermé depuis le {moment(this.props.date_end).format('LL')}
            </span> : <div />}
        </CardBody>
      </Card>
    );
  }
}

SearchPageEtablissement.propTypes = {
  name: PropTypes.shape({
    initials: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
  address: PropTypes.string.isRequired,
  codeUAI: PropTypes.string.isRequired,
  date_end: PropTypes.string,
  id: PropTypes.number.isRequired,
  tags: PropTypes.array.isRequired,
};

SearchPageEtablissement.defaultProps = {
  date_end: null,
};

export default SearchPageEtablissement;
