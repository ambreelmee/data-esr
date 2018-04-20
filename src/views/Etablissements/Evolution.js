import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';

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

class Evolution extends Component {
  constructor(props) {
    super(props);

    this.state = {
      followers: [],
      isFollowersLoading: false,
      isPredecessorsLoading: false,
      institutionId: null,
      predecessors: [],
      redirectToInstitution: false,
    };
  }

  componentWillMount() {
    this.getInstitutionEvolution(this.props.etablissement_id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ redirectToInstitution: false });
    this.getInstitutionEvolution(nextProps.etablissement_id);
  }

  getInstitutionEvolution(etablissementId) {
    const customDatesets = [];
    const customYLabels =  ['Université actuelle'];
    this.setState({ isPredecessorsLoading: true, isFollowersLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${etablissementId}/predecessors`, {
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
    fetch(`${process.env.API_URL_STAGING}institutions/${etablissementId}/followers`, {
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
            borderColor: 'rgba(255,99,132,1)',
            pointBorderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgba(255,99,132,1)',
            pointHoverBorderColor: 'rgba(255,99,132,1)',
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

  render() {
    if (this.state.isFollowersLoading || this.state.isPredecessorsLoading) {
      return <p>loading</p>;
    }
    if (this.state.redirectToInstitution) {
      return <Redirect to={`/etablissements/${this.state.institutionId}`} />;
    }
    return (
      <Card className="mt-2">
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
                if (id !== 'Université actuelle') {
                  this.setState({ redirectToInstitution: true, institutionId: id });
                }
              }}
            />}
          </div>
        </CardBody>
      </Card>
    );
  }
}

Evolution.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
};

export default Evolution;
