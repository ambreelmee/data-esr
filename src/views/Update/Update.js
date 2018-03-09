import React, { Component } from 'react';
// import NewEntity from './NewEntity.js'
import {Row, Col, Card, CardHeader, CardBody, Alert} from 'reactstrap';

class Update extends Component {

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Alert color="info">
                  Pas de mise à jour en attente
                </Alert>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Update;
