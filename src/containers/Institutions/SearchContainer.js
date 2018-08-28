import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  searchFetchData, institutionsSearch, onPageClick,
  resetSearchAndDisplayFirstPage, createInstitution, toggleAddModal,
} from '../../actions/search';
import { getActiveEntity, getFormattedAddress } from '../../views/Institutions/methods';
import SearchResultCard from '../../views/Institutions/Search/SearchResultCard';
import DownloadButton from '../../views/Institutions/DownloadButton';
import SearchPagination from '../../views/Institutions/Search/SearchPagination';
import AddInstitutionButtons from '../../views/Institutions/Search/AddInstitutionButtons';
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
          <SearchResultCard
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
    return (
      <div className="p-5">
        <SearchBar
          isSearching={this.props.isSearching}
          resetSearch={this.props.resetSearch}
          search={this.props.search}
          searchValue={this.props.searchValue}
        />
        {!this.props.isSearching && !this.props.isLoading ?
          <div>
            <div className="d-flex justify-content-between">
              <DownloadButton
                name="etablissements"
                url={`${process.env.API_URL_STAGING}institutions/search?q=${encodeURI(this.props.searchValue)}&download=true`}
              />
              <div className="text-primary mt-3">{this.props.count > 0 ? `${this.props.count} établissements` : ''}</div>
            </div>
            {this.props.institutions.length === 0 ?
              <p className="text-center"><em>aucun résultat</em></p> :
              <Row> {this.renderInstitutionsCards()} </Row>}
            <div className="mt-3 d-flex justify-content-center">
              {this.props.institutions.length > 0 ?
                <SearchPagination {...this.props.links} onClick={this.props.onPageClick} /> : <div />}
            </div>
            <AddInstitutionButtons
              toggleModal={this.props.toggleModal}
              createInstitution={this.props.createInstitution}
              hasErrored={this.props.createInstitutionHasErrored}
              isLoading={this.props.createInstitutionIsLoading}
              modal={this.props.modal}
            />
          </div> : <p className="text-center"><em>chargement</em></p>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  count: state.search.countResults,
  createInstitutionHasErrored: state.search.createInstitutionHasErrored,
  createInstitutionIsLoading: state.search.createInstitutionIsLoading,
  institutions: state.search.institutionsResults,
  links: state.search.linksResults,
  modal: state.search.addModal,
  hasErrored: state.search.hasErrored,
  isLoading: state.search.isLoading,
  isSearching: state.search.isSearching,
  searchValue: state.search.searchValue,
});

const mapDispatchToProps = dispatch => ({
  toggleModal: () => dispatch(toggleAddModal()),
  createInstitution: jsonBody => dispatch(createInstitution(jsonBody)),
  fetchData: url => dispatch(searchFetchData(url)),
  onPageClick: url => dispatch(onPageClick(url)),
  resetSearch: () => dispatch(resetSearchAndDisplayFirstPage()),
  search: event => dispatch(institutionsSearch(event)),
});

SearchContainer.propTypes = {
  count: PropTypes.string,
  createInstitution: PropTypes.func.isRequired,
  createInstitutionHasErrored: PropTypes.bool,
  createInstitutionIsLoading: PropTypes.bool,
  fetchData: PropTypes.func.isRequired,
  institutions: PropTypes.array,
  isLoading: PropTypes.bool,
  isSearching: PropTypes.bool,
  links: PropTypes.object,
  modal: PropTypes.bool,
  onPageClick: PropTypes.func.isRequired,
  hasErrored: PropTypes.bool,
  resetSearch: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
};

SearchContainer.defaultProps = {
  count: '0',
  createInstitutionHasErrored: false,
  createInstitutionIsLoading: false,
  hasErrored: false,
  institutions: [],
  isLoading: true,
  isSearching: false,
  links: {},
  modal: false,
  searchValue: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
