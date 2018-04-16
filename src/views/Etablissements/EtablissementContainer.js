import React, { Component } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import AddressContainer from './Address/AddressContainer';
import NameContainer from './Name/NameContainer';

class EtablissementContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToSearchPage: false,
    };
    this.goToSearchPage = this.goToSearchPage.bind(this);
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
        <Row>
          <Col md="9">
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
          <Col md="3">
            <Row>
              ici apparaitront les rattachements
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EtablissementContainer;
