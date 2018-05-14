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
      <Card className={!this.props.date_end ? 'card-accent-primary' : 'card-accent-danger'}>
        <CardBody>
          <div>
            <Badge color={!this.props.date_end ? 'success' : 'danger'} className="float-right">
              {!this.props.date_end ? 'Actif' : 'Archivé'}
            </Badge>
            <h4>{`${this.props.name.initials} - ${this.props.name.text.toProperCase()}`}</h4>
            {this.props.codeUAI ?
              <div className="p-1 d-inline-block text-primary"><strong>{this.props.codeUAI}</strong><br /></div> :
              <div />}
            {this.props.address ? <div>{this.props.address.toProperCase()}<br /></div> : <div />}
            <Button
              outline
              id="searchpage-1"
              className="float-right"
              color="primary"
              size="sm"
              onClick={this.displayInstitutionPage}
            >
              <i className="icon-eye mr-1" />
            Afficher
            </Button>
            {this.props.tags.length > 0 ? <div> {this.renderTags()} <br /></div> : <div />}
            {this.props.date_end ?
              <span className="text-danger">
                <strong>fermé depuis le {moment(this.props.date_end).format('LL')}</strong>
              </span> : <div />}
          </div>
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
  date_start: PropTypes.string.isRequired,
  date_end: PropTypes.string,
  id: PropTypes.number.isRequired,
  tags: PropTypes.array.isRequired,
};

SearchPageEtablissement.defaultProps = {
  date_end: null,
};

export default SearchPageEtablissement;
