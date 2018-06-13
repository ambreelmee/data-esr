import React, { Component } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

import AddressContainer from './Address/AddressContainer';
import DeleteInstitution from './DeleteInstitution';
import EtablissementStatus from './EtablissementStatus';
import EvolutionContainer from './Relation/EvolutionContainer';
import NameContainer from './Name/NameContainer';
import LinkContainer from './Link/LinkContainer';
import TagContainer from './Tag/TagContainer';


class EtablissementContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      redirectToSearchPage: false,
      uai: null,
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
    this.getData();
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
        const uai = data.institution.codes.find(code => code.category === 'uai' && code.status === 'active');
        this.setState({
          date_end: data.institution.date_end,
          date_start: data.institution.date_start,
          uai: uai ? uai.content : null,
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
    return (
      <div className="animated fadeIn">
        <div className="d-flex pt-3 justify-content-between">
          <Button
            color="primary"
            className="mt-2 mb-4"
            size="lg"
            onClick={this.goToSearchPage}
          >
          Retour
          </Button>
          {!this.state.isLoading ?
            <EtablissementStatus
              date_end={this.state.date_end}
              date_start={this.state.date_start}
              id={etablissementId}
              getData={this.getData}
            /> : <div />}
          <DeleteInstitution id={etablissementId} uai={this.state.uai} />
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
              <EvolutionContainer etablissement_id={etablissementId} getData={this.getData} />
              <TagContainer etablissement_id={etablissementId} />
              <LinkContainer etablissement_id={etablissementId} />
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EtablissementContainer;
