import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Footer from '../../components/Footer/';

import InstitutionsContainer from '../../views/Institutions/InstitutionsContainer';

class Full extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props} />
          <main className="main">
            <Container fluid>
              <InstitutionsContainer />
            </Container>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Full;
