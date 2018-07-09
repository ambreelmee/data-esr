import 'moment/locale/fr';
import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { institutionsSearch, resetSearchAndDisplayFirstPage } from '../../actions/search';
import AddressContainer from '../../views/Institutions/Address/AddressContainer';
import EvolutionContainer from '../../views/Institutions/Relation/EvolutionContainer';
import NameContainer from '../../views/Institutions/Name/NameContainer';
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
    const etablissementId = parseInt(this.props.match.params.number, 10);
    if (this.state.redirectToSearchPage) {
      return <Redirect to="/etablissements" />;
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
              <NameContainer etablissement_id={etablissementId} />
            </Row>
            <AddressContainer etablissement_id={etablissementId} />
          </Col>
          <Col md="4">
            <Row className="mx-1">
              <EvolutionContainer etablissement_id={etablissementId} />
              <TagContainer etablissement_id={etablissementId} />
              <LinkContainer etablissement_id={etablissementId} />
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
});

const mapDispatchToProps = dispatch => ({
  search: event => dispatch(institutionsSearch(event)),
  resetSearch: () => dispatch(resetSearchAndDisplayFirstPage()),
});

InstitutionContainer.propTypes = {
  isSearching: PropTypes.bool,
  resetSearch: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
};

InstitutionContainer.defaultProps = {
  isSearching: false,
  searchValue: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(InstitutionContainer);
