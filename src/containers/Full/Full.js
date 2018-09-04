import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Footer from '../../components/Footer/';
import PrivateRoute from '../../PrivateRoute';
import { getAllCategories } from '../../actions/institution';
import AddressContainer from '../Institutions/AddressContainer';
import Admin from '../Institutions//Admin';
import CodeContainer from '../Institutions/CodeContainer';
import ConnectionContainer from '../Institutions/ConnectionContainer';
import EvolutionContainer from '../Institutions/EvolutionContainer';
import InstitutionContainer from '../Institutions/InstitutionContainer';
import LinkContainer from '../Institutions/LinkContainer';
import NameContainer from '../Institutions/NameContainer';
import SearchContainer from '../Institutions/SearchContainer';
import TagContainer from '../Institutions/TagContainer';
import UpdateContainer from '../../views/Institutions/Update/UpdateContainer';

class Full extends Component {
  componentWillMount() {
    this.props.getAllCategories();
  }

  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props} />
          <main className="main">
            <Container fluid>
              <Switch>
                <PrivateRoute exact path="/etablissements"component={SearchContainer} />
                <PrivateRoute exact path="/etablissements/:number" component={InstitutionContainer} />
                <PrivateRoute path="/etablissements/:number/adresses" component={AddressContainer} />
                <PrivateRoute path="/etablissements/:number/identifiants/:category" component={CodeContainer} />
                <PrivateRoute path="/etablissements/:number/evolutions" component={EvolutionContainer} />
                <PrivateRoute path="/etablissements/:number/liens" component={LinkContainer} />
                <PrivateRoute path="/etablissements/:number/noms" component={NameContainer} />
                <PrivateRoute path="/etablissements/:number/rattachements" component={ConnectionContainer} />
                <PrivateRoute path="/etablissements/:number/tags/:category" component={TagContainer} />
                <PrivateRoute path="/admin" component={Admin} />
                <PrivateRoute path="/mises-a-jour" component={UpdateContainer} />
                <Redirect from="/" to="/etablissements" />
              </Switch>
            </Container>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  getAllCategories: () => dispatch(getAllCategories()),
});

Full.propTypes = {
  getAllCategories: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Full);
