import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Footer from '../../components/Footer/';
import PrivateRoute from '../../PrivateRoute';
import { getConnectionCategories, getEvolutionCategories } from '../../actions/institution';
import SearchContainer from '../Institutions/SearchContainer';
import InstitutionContainer from '../Institutions/InstitutionContainer';
import AddressContainer from '../Institutions/AddressContainer';
import EvolutionContainer from '../Institutions/EvolutionContainer';
import NameContainer from '../Institutions/NameContainer';
import UpdateContainer from '../../views/Institutions/Update/UpdateContainer';
import Admin from '../../views/Institutions/Admin/Admin';

class Full extends Component {
  componentWillMount() {
    this.props.getConnectionCategories();
    this.props.getEvolutionCategories();
  }

  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props} />
          <main className="main">
            <Container fluid className="bckgnd-img h-100 pb-3">
              <Switch>
                <PrivateRoute exact path="/etablissements"component={SearchContainer} />
                <PrivateRoute exact path="/etablissements/:number" component={InstitutionContainer} />
                <PrivateRoute path="/etablissements/:number/adresses" component={AddressContainer} />
                <PrivateRoute path="/etablissements/:number/evolutions" component={EvolutionContainer} />
                <PrivateRoute path="/etablissements/:number/noms" component={NameContainer} />
                <PrivateRoute path="/etablissements/:number/rattachements" component={EvolutionContainer} />
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

const mapStateToProps = state => ({
  connectionCategories: state.connectionCategories,
  evolutionCategories: state.evolutionCategories,
});

const mapDispatchToProps = dispatch => ({
  getConnectionCategories: () => dispatch(getConnectionCategories()),
  getEvolutionCategories: () => dispatch(getEvolutionCategories()),
});

Full.propTypes = {
  connectionCategories: PropTypes.array,
  evolutionCategories: PropTypes.array,
  getConnectionCategories: PropTypes.func,
  getEvolutionCategories: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(Full);
