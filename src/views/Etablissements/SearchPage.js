import React, { Component } from 'react';
import {
  Badge, Button, FormGroup, Form, InputGroup, InputGroupAddon,
  Row, Col, Card, CardBody, Input,
} from 'reactstrap';

class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      institutions: {},
      isLoading: false,
    };
    this.getData = this.getData.bind(this);
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    this.getData();
  }

  getData() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          institutions: data.institution,
          isLoading: false,
        });
      });
  }

  render() {
    if (this.state.isLoading) {
      return <p>Loading...</p>;
    }
    return (
      <div>
        <Form className="m-5 form-inline justify-content-center">
          <FormGroup row className="w-75">
            <Col md="12">
              <InputGroup>
                <Input type="text" placeholder="Rechercher un établissement..." />
                <InputGroupAddon>
                  <Button type="button" color="primary"><i className="fa fa-search" /> Rechercher</Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </FormGroup>
        </Form>
        <Row>
          <Col md="4">
            <Card className="card-accent-primary">
              <CardBody>
                <div>
                  <Badge color="success" className="float-right">
                    Actif
                  </Badge>
                  <h4>CentraleSupelec</h4>
                  <Badge color="primary" pill>Etablissement d enseignment supérieur</Badge><br />
                  <em> campus de Gif </em><br />
                   5 rue Joliot Curie, 91190 Gif sur Yvette <br />
                  <Button
                    outline
                    id="searchpage-1"
                    className="float-right"
                    color="primary"
                    size="sm"
                  >
                    <i className="icon-eye mr-1" />
                   Afficher
                  </Button>
                   depuis le 18/10/2015
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SearchPage;
