import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  institutionsFetchData, institutionsSearch, onPageClick,
  resetSearchAndDisplayFirstPage,
} from '../../actions/search';
import { getActiveEntity, getFormattedAddress } from '../../views/Institutions/methods';
import SearchPageEtablissement from '../../views/Institutions/Search/SearchPageEtablissement';
import DownloadButton from '../../views/Institutions/DownloadButton';
import SearchPagination from '../../views/Institutions/Search/SearchPagination';
import AddInstitutionButtons from '../../views/Institutions/AddInstitutionButtons';
import SearchBar from '../../views/Institutions/Search/SearchBar';

class SearchContainer extends Component {
  componentWillMount() {
    if (!this.props.searchValue) {
      this.props.fetchData(`${process.env.API_URL_STAGING}institutions?page_size=18`);
    }
  }

  renderInstitutionsCards() {
    return this.props.institutions.map((institution) => {
      const codeUAI = institution.codes.find(code => code.category === 'uai');
      return (
        <Col xs="12" md="6" lg="4" className="my-1 px-1" key={`institution-${institution.id}`}>
          <SearchPageEtablissement
            address={getActiveEntity(institution.addresses) ?
              getFormattedAddress(getActiveEntity(institution.addresses)) : ' '}
            codeUAI={codeUAI ? codeUAI.content : ''}
            date_start={institution.date_start}
            date_end={institution.date_end}
            id={institution.id}
            name={getActiveEntity(institution.names) ? getActiveEntity(institution.names) : institution.names[0]}
            tags={institution.tags}
          />
        </Col>
      );
    });
  }

  render() {
    moment.locale('fr');
    if (this.props.hasErrored) {
      return <p>Une erreur est survenue</p>;
    }
    if (this.props.isLoading) {
      return <p />;
    }
    return (
      <div className="p-5">
        <SearchBar
          isSearching={this.props.isSearching}
          resetSearch={this.props.resetSearch}
          search={this.props.search}
          searchValue={this.props.searchValue}
        />
        <div className="d-flex justify-content-between">
          {!this.props.isSearching && !this.props.isLoading ?
            <DownloadButton
              name="etablissements"
              url={`${process.env.API_URL_STAGING}institutions/search?q=${encodeURI(this.props.searchValue)}&download=true`}
            /> : <div />}
          <div className="text-primary mt-3">{this.props.count > 0 ? `${this.props.count} établissements` : ''}</div>
        </div>
        {this.props.institutions.length === 0 ?
          <p className="text-center"><em>aucun résultat</em></p> :
          <Row> {this.renderInstitutionsCards()} </Row>}
        <div className="mt-3 d-flex justify-content-center">
          {this.props.institutions.length > 0 ?
            <SearchPagination {...this.props.links} onClick={this.props.onPageClick} /> : <div />}
        </div>
        <AddInstitutionButtons />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  count: state.search.countResults,
  institutions: state.search.institutionsResults,
  links: state.search.linksResults,
  hasErrored: state.search.institutionsHasErrored,
  isLoading: state.search.institutionsIsLoading,
  isSearching: state.search.isSearching,
  searchValue: state.search.searchValue,
});

const mapDispatchToProps = dispatch => ({
  fetchData: url => dispatch(institutionsFetchData(url)),
  onPageClick: url => dispatch(onPageClick(url)),
  search: event => dispatch(institutionsSearch(event)),
  resetSearch: () => dispatch(resetSearchAndDisplayFirstPage()),
});

SearchContainer.propTypes = {
  count: PropTypes.string,
  fetchData: PropTypes.func.isRequired,
  institutions: PropTypes.array,
  isLoading: PropTypes.bool,
  isSearching: PropTypes.bool,
  links: PropTypes.object,
  onPageClick: PropTypes.func.isRequired,
  hasErrored: PropTypes.bool,
  resetSearch: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
};

SearchContainer.defaultProps = {
  count: '0',
  hasErrored: false,
  institutions: [],
  isLoading: false,
  isSearching: false,
  links: {},
  searchValue: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
