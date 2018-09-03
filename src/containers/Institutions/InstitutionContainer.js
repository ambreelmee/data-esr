import 'moment/locale/fr';
import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addContent, institutionsSearch, resetSearchAndDisplayFirstPage } from '../../actions/search';
import { getActiveInstitution, getDaughters, getMothers, removeActiveItem } from '../../actions/institution';
import { getActiveEntity } from '../../views/Institutions/methods';
import EvolutionCardContainer from './EvolutionCardContainer';
import LinkCard from '../../views/Institutions/InstitutionPage/Main/LinkCard';
import SearchBar from '../../views/Institutions/Search/SearchBar';
import AddressCard from '../../views/Institutions/InstitutionPage/Main/Address/AddressCard';
import ConnectionCard from '../../views/Institutions/InstitutionPage/Main/ConnectionCard';
import CodeCard from '../../views/Institutions/InstitutionPage/Main/CodeCard';
import TagCard from '../../views/Institutions/InstitutionPage/Main/TagCard';
import LeafletMap from '../../views/Institutions/InstitutionPage/Main/Address/LeafletMap';


class InstitutionContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addressDropdown: false,
    };
    this.displayDropdown = this.displayDropdown.bind(this);
  }


  componentWillMount() {
    const institutionId = parseInt(this.props.match.params.number, 10);
    this.props.removeActiveItem();
    if (!this.props.activeInstitution || this.props.activeInstitution.id !== institutionId) {
      this.props.getActiveInstitution(institutionId);
    }
  }

  componentDidMount() {
    window.onpopstate = this.onBackButtonEvent;
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.number && nextProps.match.params.number !== this.props.match.params.number) {
      this.props.match.params.number = nextProps.match.params.number;
      const institutionId = parseInt(this.props.match.params.number, 10);
      this.props.getActiveInstitution(institutionId);
    }
  }

  displayDropdown(event) {
    this.setState({
      [event.target.id]: !this.state[event.target.id],
    });
  }

  renderCodes(institutionId) {
    const activeCodes = this.props.activeInstitution.codes.filter(code => code.status === 'active');
    return activeCodes.map(code => (
      <CodeCard
        key={code.id}
        category={code.category}
        content={code.content}
        institutionId={institutionId}
      />));
  }


  renderTags(institutionId) {
    return this.props.activeInstitution.tags.map(tag => (
      <TagCard
        key={tag.id}
        category={tag.category}
        long_label={tag.long_label}
        institutionId={institutionId}
      />));
  }

  render() {
    moment.locale('fr');
    const institutionId = parseInt(this.props.match.params.number, 10);
    if (this.props.isLoading) {
      return <p />;
    }
    const replacementAddress = this.props.activeInstitution.addresses ? this.props.activeInstitution.addresses[0] : null;
    const displayedAddress = getActiveEntity(this.props.activeInstitution.addresses) ?
      getActiveEntity(this.props.activeInstitution.addresses) : replacementAddress;
    return (
      <div className="animated fadeIn">
        <SearchBar
          isSearching={this.props.isSearching}
          resetSearch={this.props.resetSearch}
          search={this.props.search}
          searchPage={false}
          searchValue={this.props.searchValue}
        />
        <EvolutionCardContainer institutionId={institutionId} />
        <div className="d-flex flex-wrap align-content-start justify-content-center m-2">
          {this.props.activeInstitution.tags.length > 0 ? this.renderTags(institutionId) : ''}
        </div>
        <Row>
          <Col md="5" className="pl-3 pr-1">
            <AddressCard
              displayedAddress={displayedAddress}
              dropdown={this.state.addressDropdown}
              displayDropdown={this.displayDropdown}
              id={displayedAddress ? displayedAddress.id : null}
              institutionId={institutionId}
            />
            {displayedAddress && displayedAddress.latitude && displayedAddress.longitude ?
              <LeafletMap
                addContent={this.props.addContent}
                formattedAddress={
                  <p>
                    {displayedAddress.address_1}
                    {displayedAddress.address_2 ? <br /> : <span />}
                    {displayedAddress.address_2}<br />
                    {`${displayedAddress.zip_code} ,${displayedAddress.city}`}<br />
                    {displayedAddress.country}
                  </p>}
                id={displayedAddress.id}
                institutionId={institutionId}
                isLoading={this.props.addContentIsLoading}
                latitude={displayedAddress.latitude}
                longitude={displayedAddress.longitude}
              /> : <div />}
          </Col>
          <Col md="3" className="pr-1">
            {this.props.activeInstitution.codes.length > 0 ? this.renderCodes(institutionId) : ''}
          </Col>
          <Col md="4">
            {!this.props.mothersIsLoading && !this.props.daughtersIsLoading ?
              <ConnectionCard
                mothers={this.props.mothers}
                daughters={this.props.daughters}
                institutionId={institutionId}
              /> : <div />}
            <LinkCard institutionId={institutionId} links={this.props.activeInstitution.links} />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeInstitution: state.activeInstitution.institution,
  addContentHasErrored: state.activeInstitution.addContentHasErrored,
  addContentIsLoading: state.activeInstitution.addContentIsLoading,
  daughters: state.activeInstitution.daughters,
  daughtersIsLoading: state.activeInstitution.daughtersIsLoading,
  isLoading: state.activeInstitution.isLoading,
  isSearching: state.search.isSearching,
  mothers: state.activeInstitution.mothers,
  mothersIsLoading: state.activeInstitution.mothersIsLoading,
  searchValue: state.search.searchValue,
});

const mapDispatchToProps = dispatch => ({
  addContent: (url, jsonBody, method, institutionId) => dispatch(addContent(url, jsonBody, method, institutionId)),
  getActiveInstitution: id => dispatch(getActiveInstitution(id)),
  getDaughters: id => dispatch(getDaughters(id)),
  getMothers: id => dispatch(getMothers(id)),
  removeActiveItem: () => dispatch(removeActiveItem()),
  resetSearch: () => dispatch(resetSearchAndDisplayFirstPage()),
  search: event => dispatch(institutionsSearch(event)),
});

InstitutionContainer.propTypes = {
  activeInstitution: PropTypes.object,
  addContent: PropTypes.func.isRequired,
  addContentHasErrored: PropTypes.bool,
  addContentIsLoading: PropTypes.bool,
  daughters: PropTypes.array,
  daughtersIsLoading: PropTypes.bool,
  getMothers: PropTypes.func.isRequired,
  getActiveInstitution: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isSearching: PropTypes.bool,
  mothers: PropTypes.array,
  mothersIsLoading: PropTypes.bool,
  removeActiveItem: PropTypes.func.isRequired,
  resetSearch: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
};

InstitutionContainer.defaultProps = {
  activeInstitution: undefined,
  addContentHasErrored: false,
  addContentIsLoading: false,
  daughtersIsLoading: false,
  mothersIsLoading: false,
  isLoading: true,
  isSearching: false,
  searchValue: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(InstitutionContainer);
