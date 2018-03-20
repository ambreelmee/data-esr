import React, { Component } from 'react';

// import NewEntity from './NewEntity.js'
import { Row, Col, Card, CardBody, Alert } from 'reactstrap';


class Update extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hits: [],
      isLoading: false,
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    fetch('https://hn.algolia.com/api/v1/search?query=')
      .then(response => response.json())
      .then((data) => {
        this.setState({
          hits: data.hits,
          isLoading: false,
        });
      });
  }

  render() {
    const { hits, isLoading } = this.state;

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
                    {hits.map(hit => (
                      <div key={hit.objectID}>
                        <a href={hit.url}>{hit.title}</a>
                      </div>))}
                  </div>
                </Alert>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Update;
