import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import moment from 'moment';

import AddressContainer from './Address/AddressContainer';
import EvolutionContainer from './Relation/EvolutionContainer';
import NameContainer from './Name/NameContainer';
import LinkContainer from './Link/LinkContainer';
import TagContainer from './Tag/TagContainer';


class EtablissementContainer extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.number) {
      this.props.match.params.number = nextProps.match.params.number;
    }
  }

  render() {
    moment.locale('fr');
    const etablissementId = parseInt(this.props.match.params.number, 10);
    return (
      <div className="animated fadeIn">
        <Row>
          <Col md="8">
            <Row>
              <NameContainer etablissement_id={etablissementId} />
            </Row>
            <AddressContainer etablissement_id={etablissementId} />
          </Col>
          <Col md="4">
            <Row className="mx-1">
              <EvolutionContainer etablissement_id={etablissementId} />
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
