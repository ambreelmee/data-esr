import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Switch, Route, Redirect } from 'react-router-dom'
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Footer from '../../components/Footer/';
import PrivateRoute from '../../PrivateRoute';
import Update from '../../views/Update/Update';
import InstitutionsContainer from '../../views/Institutions/InstitutionsContainer';
import EtablissementContainer from '../../views/Etablissements/EtablissementContainer';

const Full = props => (
  <div className="app">
    <Header />
    <div className="app-body">
      <Sidebar {...props} />
      <main className="main">
        <Container fluid>
          <Switch>
            <PrivateRoute path="/etablissements" name="Etablissements" component={EtablissementContainer} />
            <PrivateRoute path="/dashboard" name="Dashboard" component={Update} />
            <PrivateRoute path="/referentiel" name="Référentiels" component={Update} />
            <PrivateRoute path="/database" name="Database" component={InstitutionsContainer} />
            <Redirect from="/" to="/etablissements" />
          </Switch>
        </Container>
      </main>
    </div>
    <Footer />
  </div>
);

export default Full;
