import 'moment/locale/fr';
import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { institutionsSearch, resetSearchAndDisplayFirstPage } from '../../actions/search';
import { getActiveInstitution } from '../../actions/institution';
import AddressContainer from '../../views/Institutions/Address/AddressContainer';
import EvolutionContainer from '../../views/Institutions/Relation/EvolutionContainer';
import NameContainer from './NameContainer';
import LinkContainer from '../../views/Institutions/Link/LinkContainer';
import TagContainer from '../../views/Institutions/Tag/TagContainer';
import SearchBar from '../../views/Institutions/Search/SearchBar';


class InstitutionContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToSearchPage: false,
    };
    this.onBackButtonEvent = this.onBackButtonEvent.bind(this);
  }

  componentWillMount() {
    const institutionId = parseInt(this.props.match.params.number, 10);
    this.props.getActiveInstitution(institutionId);
  }

  componentDidMount() {
    window.onpopstate = this.onBackButtonEvent;
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.number) {
      this.props.match.params.number = nextProps.match.params.number;
    }
  }

  onBackButtonEvent(event) {
    event.preventDefault();
    this.setState({
      redirectToSearchPage: true,
    });
  }


  render() {
    moment.locale('fr');
    const institutionId = parseInt(this.props.match.params.number, 10);
    if (this.state.redirectToSearchPage) {
      return <Redirect to="/etablissements" />;
    }
    if (this.props.isLoading) {
      return <p />;
    }
    return (
      <div className="animated fadeIn">
        <SearchBar
          isSearching={this.props.isSearching}
          resetSearch={this.props.resetSearch}
          search={this.props.search}
          searchPage={false}
          searchValue={this.props.searchValue}
        />
        <Row>
          <Col md="8">
            <Row>
              <NameContainer getActiveInstitution={this.props.getActiveInstitution} />
            </Row>
            <AddressContainer etablissement_id={institutionId} />
          </Col>
          <Col md="4">
            <Row className="mx-1">
              <EvolutionContainer etablissement_id={institutionId} />
              <TagContainer etablissement_id={institutionId} />
              <LinkContainer etablissement_id={institutionId} />
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isSearching: state.search.isSearching,
  searchValue: state.search.searchValue,
  isLoading: state.activeInstitution.isLoading,
});

const mapDispatchToProps = dispatch => ({
  getActiveInstitution: id => dispatch(getActiveInstitution(id)),
  resetSearch: () => dispatch(resetSearchAndDisplayFirstPage()),
  search: event => dispatch(institutionsSearch(event)),
});

InstitutionContainer.propTypes = {
  getActiveInstitution: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isSearching: PropTypes.bool,
  resetSearch: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
};

InstitutionContainer.defaultProps = {
  isLoading: true,
  isSearching: false,
  searchValue: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(InstitutionContainer);
