import React, { Component } from 'react';

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
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = 'https://esr-backend.herokuapp.com/api/institutions';
    fetch(proxyUrl + targetUrl)
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
      id_esr: '139',
      name: 'EcoleImaginaire5',
      date_start: '12/01/2018',
      date_end: '01/01/2020',
    };
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = 'https://esr-backend.herokuapp.com/api/institutions';
    fetch(proxyUrl + targetUrl, {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(institution),
    })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
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
