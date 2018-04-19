import React, { Component } from 'react';
import { Button, Col, Row, Card, CardColumns, CardHeader, CardBody } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { Line } from 'react-chartjs-2';

import AddressContainer from './Address/AddressContainer';
import NameContainer from './Name/NameContainer';

const line = {
  xLabels: ['Prédecesseurs', 'Actuel', 'Successeurs'],
  yLabels: [],
  title: 'Evolutions',
  datasets: [],
};

const options = {
  responsive: true,
  legend: { display: false },
  scales: {
    xAxes: [{
      display: false,
    }],
    yAxes: [{
      type: 'category',
      position: 'left',
      display: false,
    }],
  },
  layout: {
    padding: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10,
    },
  },
  tooltips: { displayColors: false },
};

class EtablissementContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      followers: [],
      isFollowersLoading: false,
      isPredecessorsLoading: false,
      institutionId: null,
      predecessors: [],
      redirectToSearchPage: false,
      redirectToInstitution: false,
    };
    this.goToSearchPage = this.goToSearchPage.bind(this);
  }

  componentWillMount() {
    this.getInstitutionEvolution('predecessors');
    this.getInstitutionEvolution('followers');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.number) {
      this.props.match.params.number = nextProps.match.params.number;
      this.setState({ redirectToInstitution: false })
      this.getInstitutionEvolution('predecessors')
      this.getInstitutionEvolution('followers')
    }
  }

  getInstitutionEvolution() {
    const customDatesets = [];
    const customYLabels =  ['Université actuelle'];
    this.setState({ isPredecessorsLoading: true, isFollowersLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${parseInt(this.props.match.params.number, 10)}/predecessors`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((predecessors) => {
        let count = 0;
        predecessors.map((predecessor) => {
          const datasetObject = {
            label: '',
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            data: ['Université actuelle'],
          };
          datasetObject.data.unshift(`${predecessor.id}`);
          datasetObject.label = `${predecessor.id}`;
          if (count % 2 === 0) {
            customYLabels.push(`${predecessor.id}`);
          } else {
            customYLabels.unshift(`${predecessor.id}`);
          }
          customDatesets.push(datasetObject);
          count += 1;
        });
        customYLabels.push();
        this.setState({
          predecessors,
          isPredecessorsLoading: false
        });
      });
    fetch(`${process.env.API_URL_STAGING}institutions/${parseInt(this.props.match.params.number, 10)}/followers`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((followers) => {
        let count = 0;
        followers.map((follower) => {
          const datasetObject = {
            label: '',
            fill: false,
            borderColor: 'rgba(75,192,19,1)',
            pointBorderColor: 'rgba(75,192,19,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgba(75,192,19,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            data: ['Université actuelle'],
          };
          datasetObject.data.unshift('');
          datasetObject.data.push(`${follower.id}`);
          datasetObject.label = `${follower.id}`;
          if (count % 2 === 0) {
            customYLabels.push(`${follower.id}`);
          } else {
            customYLabels.unshift(`${follower.id}`);
          }
          customDatesets.push(datasetObject);
          count += 1;
        });
        this.setState({
          followers,
          isFollowersLoading: false,
          customDatesets,
          customYLabels,
        });
      });
  }

  goToSearchPage() {
    this.setState({
      redirectToSearchPage: true,
    });
  }

  render() {
    const etablissementId = parseInt(this.props.match.params.number, 10);
    if (this.state.redirectToSearchPage) {
      return <Redirect to="/etablissements" />;
    }
    if (this.state.redirectToInstitution) {
      return <Redirect to={`/etablissements/${this.state.institutionId}`} />;
    }
    if (this.state.isFollowersLoading || this.state.isPredecessorsLoading) {
      return <p>loading</p>
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
              <div className="animated fadeIn">
                <Card>
                  <CardBody>
                    <div className="chart-wrapper">
                      Evolutions
                      {this.state.isFollowersLoading || this.state.isPredecessorsLoading ? <div /> :
                      <Line
                        data={{
                          xLabels: ['Prédecesseurs', 'Actuel', 'Successeurs'],
                          yLabels: this.state.customYLabels,
                          title: 'Evolutions',
                          datasets: this.state.customDatesets,
                        }}
                        options={options}
                        getElementAtEvent={(elems) => {
                          const datasetIndex = elems[0]._datasetIndex;
                          const index = elems[0]._index;
                          const id = elems[0]._chart.config.data.datasets[datasetIndex].data[index];
                          console.log(id);
                          if (id !== 'Université actuelle') {
                            this.setState({ redirectToInstitution: true, institutionId: id });
                          }
                        }}
                      />}
                    </div>
                  </CardBody>
                </Card>
              </div>
              </Col>
            </Row>
            <NameContainer etablissement_id={etablissementId} />
            <AddressContainer etablissement_id={etablissementId} />
          </Col>
          <Col md="3">
            <Row>coucou les rattachements
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EtablissementContainer;
