import React, { Component } from 'react';
import btoa from 'btoa';

// import NewEntity from './NewEntity.js'
import { Button, Row, Col, Card, CardBody, Alert } from 'reactstrap';


class Update extends Component {
  constructor(props) {
    super(props);

    this.state = {
      institutions: [],
      isLoading: false,
    };
    this.postInstitution = this.postInstitution.bind(this);
  }

  componentWillMount() {
    this.getInstitution();
  }

  getInstitution() {
    this.setState({ isLoading: true });
    fetch(`${process.env.PROXY_URL + process.env.API_URL}institutions`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Basic ${btoa(`${localStorage.getItem('token')}:`)}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          institutions: data.institutions,
          isLoading: false,
        });
      });
  }

  postInstitution(event) {
    event.preventDefault();
    const institution = {
      id_esr: '140',
      name: 'EcoleImaginaire6',
      date_start: '12/01/2018',
      date_end: '01/01/2020',
    };
    fetch(`${process.env.PROXY_URL + process.env.API_URL}institutions`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${localStorage.getItem('token')}:`)}`,
      }),
      body: JSON.stringify(institution),
    })
      .then(res => res.json())
      .then((data) => {
        this.setState({
          institutions: this.state.institutions.concat([data]),
        });
      });
  }


  render() {
    const { institutions, isLoading } = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Alert color="info">
                  <div>
                    {institutions.map(institution => (
                      <div key={institution.id_esr}>
                        {institution.name}
                      </div>))}
                  </div>
                </Alert>
              </CardBody>
              <CardBody>
                <Button outline color="primary" size="lg" block onClick={this.postInstitution}>
                Créer un établissement
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Update;
