import React from 'react';
import { Container } from 'reactstrap';
import { Switch, Redirect } from 'react-router-dom';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Footer from '../../components/Footer/';
import PrivateRoute from '../../PrivateRoute';
import SearchContainer from '../../views/Etablissements/SearchContainer';
import EtablissementContainer from '../../views/Etablissements/EtablissementContainer';
import SubMenuContainer from '../../views/SubMenus/SubMenuContainer';
import UpdateContainer from '../../views/SubMenus/Update/UpdateContainer';

const Full = props => (
  <div className="app">
    <Header />
    <div className="app-body">
      <Sidebar {...props} />
      <main className="main">
        <Container fluid className="bckgnd-img h-100 pb-3">
          <Switch>
            <PrivateRoute exact path="/etablissements"component={SearchContainer} />
            <PrivateRoute path="/etablissements/:number" component={EtablissementContainer} />
            <PrivateRoute path="/liens" component={SubMenuContainer} categoryType="link" routePath="links" />
            <PrivateRoute path="/codes" component={SubMenuContainer} categoryType="code" routePath="codes" />
            <PrivateRoute
              path="/evolutions"
              component={SubMenuContainer}
              categoryType="institution_evolution"
              routePath="evolutions"
            />
            <PrivateRoute
              path="/rattachements"
              component={SubMenuContainer}
              categoryType="institution_connection"
              routePath="connections"
            />
            <PrivateRoute path="/caracterisations" component={SubMenuContainer} routePath="taggings" />
            <PrivateRoute path="/adresses" component={SubMenuContainer} routePath="addresses" />
            <PrivateRoute path="/mises-a-jour" component={UpdateContainer} />
            <Redirect from="/" to="/etablissements" />
          </Switch>
        </Container>
      </main>
    </div>
    <Footer />
  </div>
);

export default Full;
