import React, { Component } from 'react';
// import NewEntity from './NewEntity.js'
import {Row, Col, Card, CardHeader, CardBody, Alert} from 'reactstrap';


class Update extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hits: [],
      isLoading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    fetch('https://hn.algolia.com/api/v1/search?query=')
    .then(response => response.json())
    .then( data => {
      this.setState({
        hits: data.hits,
        isLoading: false
      })
    })
    .catch(error => this.setState({ error, isLoading: false }));
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
                    {hits.map(hit =>
                      <div key={hit.objectID}>
                        <a href={hit.url}>{hit.title}</a>
                      </div>
                    )}
                  </div>
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
