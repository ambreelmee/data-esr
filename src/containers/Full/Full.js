import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Footer from '../../components/Footer/';

import Update from '../../views/Update/';

class Full extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props} />
          <main className="main">
            <Container fluid>
              <Update />
            </Container>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Full;
