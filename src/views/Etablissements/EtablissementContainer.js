import React, { Component } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

import AddressContainer from './Address/AddressContainer';
import EtablissementStatus from './EtablissementStatus';
import Evolution from './Evolution/Evolution';
import NameContainer from './Name/NameContainer';
import LinkContainer from './Link/LinkContainer';


class EtablissementContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      redirectToSearchPage: false,
    };
    this.goToSearchPage = this.goToSearchPage.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentWillMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.number) {
      this.props.match.params.number = nextProps.match.params.number;
    }
  }

  getData() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${parseInt(this.props.match.params.number, 10)}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          date_end: data.institution.date_end,
          date_start: data.institution.date_start,
          isLoading: false,
        });
      });
  }

  goToSearchPage() {
    this.setState({
      redirectToSearchPage: true,
    });
  }

  render() {
    const locale = window.navigator.userLanguage || window.navigator.language;
    moment.locale(locale);
    const etablissementId = parseInt(this.props.match.params.number, 10);
    if (this.state.redirectToSearchPage) {
      return <Redirect to="/etablissements" />;
    }
    if (this.state.isFollowersLoading || this.state.isPredecessorsLoading) {
      return <p>loading</p>;
    }
    return (
      <div className="animated fadeIn">
        <div className="d-flex d-inline-block pt-3">
          <Button
            color="primary"
            className="mt-2 mb-4 mr-3"
            size="lg"
            onClick={this.goToSearchPage}
          >
          Retour
          </Button>
          <EtablissementStatus
            date_end={this.state.date_end}
            date_start={this.state.date_start}
            id={etablissementId}
            getData={this.getData}
          />
        </div>
        <Row>
          <Col md="8">
            <Row>
              <NameContainer etablissement_id={etablissementId} />
            </Row>
            <AddressContainer etablissement_id={etablissementId} />
          </Col>
          <Col md="4">
            <Row className="mx-1">
              <Evolution etablissement_id={etablissementId} />
              <LinkContainer etablissement_id={etablissementId} />
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EtablissementContainer;
