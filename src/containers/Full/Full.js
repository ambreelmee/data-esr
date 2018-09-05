import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Footer from '../../components/Footer/';
import PrivateRoute from '../../PrivateRoute';
import { getAllCategories, getActiveInstitution } from '../../actions/institution';
import AddressContainer from '../Institutions/AddressContainer';
import Admin from '../Institutions//Admin';
import CodeContainer from '../Institutions/CodeContainer';
import ConnectionContainer from '../Institutions/ConnectionContainer';
import EvolutionContainer from '../Institutions/EvolutionContainer';
import InstitutionContainer from '../Institutions/InstitutionContainer';
import LinkContainer from '../Institutions/LinkContainer';
import NameContainer from '../Institutions/NameContainer';
import InstitutionSearchContainer from '../Institutions/InstitutionSearchContainer';
import TagContainer from '../Institutions/TagContainer';
import UpdateContainer from '../../views/Institutions/Update/UpdateContainer';
import CompaniesSearchContainer from '../Companies/CompaniesSearchContainer';

class Full extends Component {
  componentWillMount() {
    this.props.getAllCategories();
    const institutionId = this.props.location.pathname.split('/')[2];
    if (institutionId) {
      this.props.getActiveInstitution(parseInt(institutionId, 10))
    }
  }

  componentWillReceiveProps(nextProps) {
    const institutionId = nextProps.location.pathname.split('/')[2];
    if (!(this.props.activeInstitution && this.props.activeInstitution.id.toString() === institutionId)) {
      this.props.getActiveInstitution(parseInt(institutionId, 10))
    }
  }

  render() {
    if (this.props.location.pathname.split('/')[2] && (!this.props.activeInstitution || !this.props.activeInstitution.id)) {
      return <p>Loading</p>;
    }
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props} />
          <main className="main">
            <Container fluid>
              <Switch>
                <PrivateRoute exact path="/etablissements"component={InstitutionSearchContainer} />
                <PrivateRoute exact path="/etablissements/:number" component={InstitutionContainer} />
                <PrivateRoute path="/etablissements/:number/adresses" component={AddressContainer} />
                <PrivateRoute path="/etablissements/:number/identifiants/:category" component={CodeContainer} />
                <PrivateRoute path="/etablissements/:number/evolutions" component={EvolutionContainer} />
                <PrivateRoute path="/etablissements/:number/liens" component={LinkContainer} />
                <PrivateRoute path="/etablissements/:number/noms" component={NameContainer} />
                <PrivateRoute path="/etablissements/:number/rattachements" component={ConnectionContainer} />
                <PrivateRoute path="/etablissements/:number/tags/:category" component={TagContainer} />
                <PrivateRoute path="/etablissements/admin" component={Admin} />
                <PrivateRoute path="/etablissements/mises-a-jour" component={UpdateContainer} />
                <PrivateRoute exact path="/entreprises"component={CompaniesSearchContainer} />
                <PrivateRoute path="/entreprises/mises-a-jour" component={UpdateContainer} />
                <PrivateRoute path="/entreprises/admin" component={Admin} />
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
  activeInstitution: state.activeInstitution.institution,
});

const mapDispatchToProps = dispatch => ({
  getAllCategories: () => dispatch(getAllCategories()),
  getActiveInstitution: id => dispatch(getActiveInstitution(id)),
});

Full.propTypes = {
  activeInstitution: PropTypes.object,
  getAllCategories: PropTypes.func.isRequired,
  getActiveInstitution: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Full);
