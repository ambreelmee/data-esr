import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Footer from '../../components/Footer/';
import PrivateRoute from '../../PrivateRoute';
import {
  getConnectionCategories, getEvolutionCategories,
  getCodeCategories, getTagCategories, getTags,
} from '../../actions/institution';
import AddressContainer from '../Institutions/AddressContainer';
import Admin from '../../views/Institutions/Admin/Admin';
import CodeContainer from '../Institutions/CodeContainer';
import ConnectionContainer from '../Institutions/ConnectionContainer';
import EvolutionContainer from '../Institutions/EvolutionContainer';
import InstitutionContainer from '../Institutions/InstitutionContainer';
import NameContainer from '../Institutions/NameContainer';
import SearchContainer from '../Institutions/SearchContainer';
import TagContainer from '../Institutions/TagContainer';
import UpdateContainer from '../../views/Institutions/Update/UpdateContainer';

class Full extends Component {
  componentWillMount() {
    this.props.getCodeCategories();
    this.props.getConnectionCategories();
    this.props.getEvolutionCategories();
    this.props.getTagCategories();
    this.props.getTags();
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
                <PrivateRoute path="/etablissements/:number/identifiants/:category" component={CodeContainer} />
                <PrivateRoute path="/etablissements/:number/evolutions" component={EvolutionContainer} />
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
  getCodeCategories: () => dispatch(getCodeCategories()),
  getConnectionCategories: () => dispatch(getConnectionCategories()),
  getEvolutionCategories: () => dispatch(getEvolutionCategories()),
  getTagCategories: () => dispatch(getTagCategories()),
  getTags: () => dispatch(getTags()),
});

Full.propTypes = {
  getCodeCategories: PropTypes.func.isRequired,
  getConnectionCategories: PropTypes.func.isRequired,
  getEvolutionCategories: PropTypes.func.isRequired,
  getTagCategories: PropTypes.func.isRequired,
  getTags: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Full);
