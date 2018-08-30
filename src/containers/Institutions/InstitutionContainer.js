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
import LinkContainer from '../../views/Institutions/InstitutionPage/Main/Link/LinkContainer';
import TagContainer from '../../views/Institutions/InstitutionPage/Main/Tag/TagContainer';
import SearchBar from '../../views/Institutions/Search/SearchBar';
import AddressCard from '../../views/Institutions/InstitutionPage/Main/Address/AddressCard';
import ConnectionCard from '../../views/Institutions/InstitutionPage/Main/ConnectionCard';
import CodeContainer from '../../views/Institutions/InstitutionPage/Main/Code/CodeContainer';
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
        <Row>
          <Col md="8">
            <EvolutionCardContainer getActiveInstitution={this.props.getActiveInstitution} />
            <Row>
              <Col md="6" className="pl-0">
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
              <Col md="6">
                <Row>
                  <CodeContainer etablissement_id={institutionId} />
                </Row>
              </Col>
            </Row>
          </Col>
          <Col md="4">
            <Row className="mx-1">
              {!this.props.mothersIsLoading && !this.props.daughtersIsLoading ?
                <ConnectionCard
                  mothers={this.props.mothers}
                  daughters={this.props.daughters}
                  institutionId={institutionId}
                /> : <div />}
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
  getFollowers: PropTypes.func.isRequired,
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
