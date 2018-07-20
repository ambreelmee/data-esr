import 'moment/locale/fr';
import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addContent, institutionsSearch, resetSearchAndDisplayFirstPage } from '../../actions/search';
import { getActiveInstitution } from '../../actions/institution';
import { getActiveEntity } from '../../views/Institutions/methods';
import EvolutionContainer from '../../views/Institutions/Relation/EvolutionContainer';
import NameMainContainer from './NameMainContainer';
import LinkContainer from '../../views/Institutions/Link/LinkContainer';
import TagContainer from '../../views/Institutions/Tag/TagContainer';
import SearchBar from '../../views/Institutions/Search/SearchBar';
import AddressCard from '../../views/Institutions/Address/AddressCard';
import ConnectionContainer from '../../views/Institutions/Relation/ConnectionContainer';
import CodeContainer from '../../views/Institutions/Code/CodeContainer';
import LeafletMap from '../../views/Institutions/Address/LeafletMap';


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
            <NameMainContainer getActiveInstitution={this.props.getActiveInstitution} />
            <Row>
              <Col md="8" className="pl-0">
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
                <ConnectionContainer etablissement_id={institutionId} />
              </Col>
              <Col md="4">
                <Row>
                  <AddressCard
                    displayedAddress={displayedAddress}
                    dropdown={this.state.addressDropdown}
                    displayDropdown={this.displayDropdown}
                    id={displayedAddress.id}
                    institutionId={institutionId}
                  />
                  <CodeContainer etablissement_id={institutionId} />
                </Row>
              </Col>
            </Row>
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
  activeInstitution: state.activeInstitution.institution,
  addContentHasErrored: state.activeInstitution.addContentHasErrored,
  addContentIsLoading: state.activeInstitution.addContentIsLoading,
  isSearching: state.search.isSearching,
  searchValue: state.search.searchValue,
  isLoading: state.activeInstitution.isLoading,
});

const mapDispatchToProps = dispatch => ({
  addContent: (url, jsonBody, method, institutionId) => dispatch(addContent(url, jsonBody, method, institutionId)),
  getActiveInstitution: id => dispatch(getActiveInstitution(id)),
  resetSearch: () => dispatch(resetSearchAndDisplayFirstPage()),
  search: event => dispatch(institutionsSearch(event)),
});

InstitutionContainer.propTypes = {
  activeInstitution: PropTypes.object,
  addContent: PropTypes.func.isRequired,
  addContentHasErrored: PropTypes.bool,
  addContentIsLoading: PropTypes.bool,
  getActiveInstitution: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isSearching: PropTypes.bool,
  resetSearch: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
};

InstitutionContainer.defaultProps = {
  activeInstitution: undefined,
  addContentHasErrored: false,
  addContentIsLoading: false,
  isLoading: true,
  isSearching: false,
  searchValue: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(InstitutionContainer);
