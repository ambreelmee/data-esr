import React, { Component } from 'react';
import { Badge, Button, Card, CardBody } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';


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
            <h4>{this.props.name}</h4>
            {this.props.address}<br />
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
            depuis le {moment(this.props.date_start).format('LL')}
            {this.props.date_end ? <span><br /> jusqu&#39;au {moment(this.props.date_end).format('LL')}</span> : <div />}
          </div>
        </CardBody>
      </Card>
    );
  }
}

SearchPageEtablissement.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  date_start: PropTypes.string.isRequired,
  date_end: PropTypes.string,
  id: PropTypes.number.isRequired,
};

SearchPageEtablissement.defaultProps = {
  date_end: null,
};

export default SearchPageEtablissement;
