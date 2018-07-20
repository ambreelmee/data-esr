import React from 'react';
import { Container } from 'reactstrap';
import { Switch, Redirect } from 'react-router-dom';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Footer from '../../components/Footer/';
import PrivateRoute from '../../PrivateRoute';
import SearchContainer from '../Institutions/SearchContainer';
import InstitutionContainer from '../Institutions/InstitutionContainer';
import AddressContainer from '../Institutions/AddressContainer';
import NameContainer from '../Institutions/NameContainer';
import SubMenuContainer from '../../views/Institutions/SubMenus/SubMenuContainer';
import UpdateContainer from '../../views/Institutions/SubMenus/Update/UpdateContainer';

const Full = props => (
  <div className="app">
    <Header />
    <div className="app-body">
      <Sidebar {...props} />
      <main className="main">
        <Container fluid className="bckgnd-img h-100 pb-3">
          <Switch>
            <PrivateRoute exact path="/etablissements"component={SearchContainer} />
            <PrivateRoute exact path="/etablissements/:number" component={InstitutionContainer} />
            <PrivateRoute path="/etablissements/:number/adresses" component={AddressContainer} />
            <PrivateRoute path="/etablissements/:number/noms" component={NameContainer} />
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
