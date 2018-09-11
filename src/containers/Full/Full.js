import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Footer from '../../components/Footer/';
import PrivateRoute from '../../PrivateRoute';
import { getAllCategories, getActiveInstitution, removeActiveItem } from '../../actions/institution';
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

const getIdFromPath = props => props.location.pathname.split('/')[2] || null;
const getParamFromPath = props => props.location.pathname.split('/')[3] || null;

const getIdfromActiveInstitution = (props) => {
  const activeInstitution = props.activeInstitution || null;
  return activeInstitution ? activeInstitution.id.toString() : null;
};

class Full extends Component {

  componentDidMount() {
    this.props.getAllCategories();
    const institutionId = getIdFromPath(this.props);
    const activeInstitutionId = getIdfromActiveInstitution(this.props)
    if (institutionId && activeInstitutionId !== institutionId) {
      this.props.getActiveInstitution(parseInt(institutionId, 10))
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   const institutionId = getIdFromPath(nextProps);
  //   const activeInstitutionId = getIdfromActiveInstitution(nextProps)
  //   if (!nextProps.isLoading && !this.props.isLoading && institutionId && activeInstitutionId !== institutionId) {
  //     this.props.getActiveInstitution(parseInt(institutionId, 10))
  //   }
  //   if (getParamFromPath(nextProps) !== getParamFromPath(this.props)) {
  //     this.props.removeActiveItem()
  //   }
  // }
  componentDidUpdate(prevProps) {
    const institutionId = getIdFromPath(this.props);
    const activeInstitutionId = getIdfromActiveInstitution(this.props)
    if (!prevProps.isLoading && !this.props.isLoading && institutionId && activeInstitutionId !== institutionId) {
      this.props.getActiveInstitution(parseInt(institutionId, 10))
    }
    if (getParamFromPath(prevProps) !== getParamFromPath(this.props)) {
      this.props.removeActiveItem()
    }
  }

  render() {
    const institutionId = getIdFromPath(this.props);
    const activeInstitutionId = getIdfromActiveInstitution(this.props)
    if (institutionId && institutionId !== activeInstitutionId) {
      return (
        <div className="app">
          <Header />
          <div className="app-body">
            <Sidebar {...this.props} />
            <main className="main">
              <Container fluid className="text center p-5 m-5">
                <i className="fa fa-spinner fa-spin ml-1" />
                Chargement
              </Container>
            </main>
          </div>
          <Footer />
        </div>
      );
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
  isLoading: state.activeInstitution.isLoading,
});

const mapDispatchToProps = dispatch => ({
  getAllCategories: () => dispatch(getAllCategories()),
  getActiveInstitution: id => dispatch(getActiveInstitution(id)),
  removeActiveItem: () => dispatch(removeActiveItem()),
});

Full.propTypes = {
  activeInstitution: PropTypes.object,
  getAllCategories: PropTypes.func.isRequired,
  getActiveInstitution: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  removeActiveItem: PropTypes.func.isRequired,
};

Full.defaultProps = {
  isLoading: false,
}

export default connect(mapStateToProps, mapDispatchToProps)(Full);
