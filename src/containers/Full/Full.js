import React from 'react';
import { Container } from 'reactstrap';
import { Switch, Redirect } from 'react-router-dom';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Footer from '../../components/Footer/';
import PrivateRoute from '../../PrivateRoute';
import SearchPage from '../../views/Etablissements/SearchPage';
import EtablissementContainer from '../../views/Etablissements/EtablissementContainer';
import CategoryContainer from '../../views/Category/CategoryContainer';
import TagCategoryContainer from '../../views/Category/TagCategoryContainer';

const Full = props => (
  <div className="app">
    <Header />
    <div className="app-body">
      <Sidebar {...props} />
      <main className="main">
        <Container fluid className="bckgnd-img h-100 pb-3">
          <Switch>
            <PrivateRoute exact path="/etablissements"component={SearchPage} />
            <PrivateRoute path="/etablissements/:number" component={EtablissementContainer} />
            <PrivateRoute path="/categories" component={CategoryContainer} />
            <PrivateRoute path="/liens" component={CategoryContainer} categoryType="link" />
            <PrivateRoute path="/codes" component={CategoryContainer} categoryType="code" />
            <PrivateRoute path="/evolutions" component={CategoryContainer} categoryType="institution_evolution" />
            <PrivateRoute path="/rattachements" component={CategoryContainer} categoryType="institution_connection" />
            <PrivateRoute path="/caracterisations" component={TagCategoryContainer} />
            <Redirect from="/" to="/etablissements" />
          </Switch>
        </Container>
      </main>
    </div>
    <Footer />
  </div>
);

export default Full;
