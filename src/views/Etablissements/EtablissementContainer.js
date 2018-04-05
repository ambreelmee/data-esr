import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

import AddressContainer from './AddressContainer';

class EtablissementContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      institution: {},
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
    fetch(`${process.env.API_URL_STAGING}institutions/1`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          institution: data.institution,
          isLoading: false,
        });
      });
  }

  render() {
    if (this.state.isLoading) {
      return <p>Loading...</p>;
    }
    return (
      <div className="animated fadeIn">
        <AddressContainer addresses={this.state.institution.addresses} getAddress={this.getData}/>
      </div>
    );
  }
}

export default EtablissementContainer;
