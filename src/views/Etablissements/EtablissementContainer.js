import React, { Component } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

import AddressContainer from './Address/AddressContainer';
import Evolution from './Evolution/Evolution';
import NameContainer from './Name/NameContainer';
import CodeContainer from './Code/CodeContainer';


class EtablissementContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToSearchPage: false,
    };
    this.goToSearchPage = this.goToSearchPage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.number) {
      this.props.match.params.number = nextProps.match.params.number;
    }
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
        <Row>
          <Col md="8">
            <Row>
              <Col md="2">
                <Row>
                  <Button
                    color="primary"
                    className="m-3"
                    size="lg"
                    onClick={this.goToSearchPage}
                  >
                  Retour
                  </Button>
                </Row>
              </Col>
              <Col md="10">
                <NameContainer etablissement_id={etablissementId} />
              </Col>
            </Row>
            <AddressContainer etablissement_id={etablissementId} />
          </Col>
          <Col md="4">
            <Row className="mx-1">
              <Evolution etablissement_id={etablissementId} />
              <CodeContainer etablissement_id={etablissementId} />
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EtablissementContainer;
